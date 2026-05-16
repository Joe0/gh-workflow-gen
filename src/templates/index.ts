import { nodeCi } from './node-ci';
import { dockerBuildPush } from './docker-build-push';
import { pythonCi } from './python-ci';
import { lint } from './lint';
import { manualRelease } from './manual-release';

const templates: Record<string, string> = {
  'node-ci': nodeCi,
  'docker-build-push': dockerBuildPush,
  'python-ci': pythonCi,
  'lint': lint,
  'manual-release': manualRelease
};

export function getTemplate(name: string): string {
  const template = templates[name];
  if (!template) {
    throw new Error(`Template '${name}' not found`);
  }
  return template;
}
