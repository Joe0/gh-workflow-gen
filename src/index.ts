#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import { getTemplate } from './templates';

const program = new Command();

program
  .name('gh-workflow-gen')
  .description('CLI tool to scaffold common GitHub Actions workflows')
  .version('1.0.0');

program
  .command('generate')
  .alias('gen')
  .description('Generate a GitHub Actions workflow')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'Select a workflow template:',
        choices: [
          { name: 'Node.js CI (test + build)', value: 'node-ci' },
          { name: 'Docker Build & Push', value: 'docker-build-push' },
          { name: 'Python CI (test + lint)', value: 'python-ci' },
          { name: 'Basic Linting', value: 'lint' },
          { name: 'Manual Release Trigger', value: 'manual-release' }
        ]
      },
      {
        type: 'input',
        name: 'filename',
        message: 'Workflow filename (without .yml):',
        default: (answers: any) => answers.template,
        validate: (input: string) => {
          if (!input || input.trim() === '') {
            return 'Filename cannot be empty';
          }
          if (!/^[a-z0-9-_]+$/.test(input)) {
            return 'Filename must contain only lowercase letters, numbers, hyphens, and underscores';
          }
          return true;
        }
      }
    ]);

    const workflowsDir = path.join(process.cwd(), '.github', 'workflows');
    if (!fs.existsSync(workflowsDir)) {
      fs.mkdirSync(workflowsDir, { recursive: true });
      console.log(`✓ Created directory: ${workflowsDir}`);
    }

    const outputPath = path.join(workflowsDir, `${answers.filename}.yml`);

    if (fs.existsSync(outputPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `File ${answers.filename}.yml already exists. Overwrite?`,
          default: false
        }
      ]);

      if (!overwrite) {
        console.log('Aborted.');
        process.exit(0);
      }
    }

    const templateContent = getTemplate(answers.template);
    fs.writeFileSync(outputPath, templateContent);
    console.log(`✓ Generated workflow: ${outputPath}`);
  });

program.parse();
