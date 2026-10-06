import test from 'node:test';
import assert from 'node:assert/strict';
import { robotPose } from '../scene.js';

test('robot gripper follows the part through pickup, lift and release', () => {
  for (const time of [1.25, 2.2, 3, 3.9]) {
    const pose = robotPose(time);
    const x = 1.18 - 1.45 * Math.sin(pose.shoulder) - 1.2 * Math.sin(pose.shoulder + pose.elbow);
    const y = 0.68 + 1.45 * Math.cos(pose.shoulder) + 1.2 * Math.cos(pose.shoulder + pose.elbow);
    assert(Math.abs(x + 0.4) < 1e-8);
    assert(Math.abs(y - 0.4 - pose.partY) < 1e-8);
    assert.equal(pose.grip, 1);
  }
  assert(robotPose(2.2).partY > 0.9);
  assert.equal(robotPose(-1).partY, 0.38);
  assert.equal(robotPose(5.15).grip, 0);
});

test('camera journey visits all disciplines continuously without reversing', async () => {
  const { journeyPose } = await import('../scene.js');
  let distance = 0;
  for (let i = 0; i <= 1000; i++) {
    const pose = journeyPose(i / 1000);
    assert(pose.distance >= distance);
    assert(pose.distance - distance < 0.02);
    assert(pose.inspection >= 0 && pose.inspection <= 0.8);
    distance = pose.distance;
  }
  assert.equal(distance, 3);
  for (let i = 0; i < 4; i++) assert.equal(journeyPose(i / 4).chapter, i);
});
