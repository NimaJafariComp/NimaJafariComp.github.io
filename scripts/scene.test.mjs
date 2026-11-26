import test from 'node:test';
import assert from 'node:assert/strict';
import { journeyPose, robotPose } from '../scene.js';

test('robot grips, transfers, and releases the block onto the second fixture', () => {
  const pickup = robotPose(0);
  const placed = robotPose(5.4);
  for (const time of [1.2, 1.85, 2.4, 2.95, 3.6]) {
    const pose = robotPose(time);
    const x = 1.18 - 1.45 * Math.sin(pose.shoulder) - 1.2 * Math.sin(pose.shoulder + pose.elbow);
    const y = 0.68 + 1.45 * Math.cos(pose.shoulder) + 1.2 * Math.cos(pose.shoulder + pose.elbow);
    assert(Math.abs(x - pose.partX) < 1e-8);
    assert(Math.abs(y - 0.4 - pose.partY) < 1e-8);
    assert.equal(pose.grip, 1);
  }
  assert(robotPose(2.4).partY > pickup.partY + 0.45);
  assert(placed.partX > pickup.partX + 1);
  assert.equal(placed.partY, pickup.partY);
  assert.equal(placed.grip, 0);
  assert(Math.abs(placed.shoulder - pickup.shoulder) < 1e-8);
  assert(Math.abs(placed.elbow - pickup.elbow) < 1e-8);
});

test('camera journey visits all disciplines continuously without reversing', () => {
  let distance = 0;
  for (let i = 0; i <= 1000; i++) {
    const pose = journeyPose(i / 1000);
    assert(pose.distance >= distance);
    assert(pose.distance - distance < 0.02);
    assert(pose.inspection >= 0 && pose.inspection <= 0.62);
    assert(pose.action >= 0 && pose.action <= 1);
    if (pose.flight > 0) assert.equal(pose.action, 1);
    distance = pose.distance;
  }
  assert.equal(distance, 3);
  for (let i = 0; i < 4; i++) {
    const arrival = journeyPose(i / 4);
    assert.equal(arrival.chapter, i);
    assert.equal(arrival.action, 0);
    assert.equal(journeyPose((i + 0.95) / 4).action, 1);
  }
});
