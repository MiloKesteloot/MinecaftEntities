let startTime = performance.now();

function getTime() {
  return (performance.now() - startTime) / 1000;
}

const DEG = 180 / Math.PI;

function sin(t, speed = 1, amp = 1, phase = 0) {
  return Math.sin(t * speed + phase) * amp;
}

function cos(t, speed = 1, amp = 1, phase = 0) {
  return Math.cos(t * speed + phase) * amp;
}

function getBaseVariables() {
  const t = getTime();

  return {
    flap_time: t * 6.0,                  // wings & jaw
    rotation_factor_translate: sin(t, 1, 1),
    clamped_pitch: sin(t, 0.5, 5),        // subtle body pitch
    clamped_roll: sin(t, 0.4, 5),         // subtle body roll
  };
}

function getNeckVariables() {
  const t = getTime();
  const vars = {};

  for (let i = 1; i <= 5; i++) {
    const phase = i * 0.6;

    vars[`neck_${i}_rotation_x`] = sin(t, 1.2, 6, phase);
    vars[`neck_${i}_rotation_y`] = sin(t, 0.9, 10, phase);
    vars[`neck_${i}_rotation_z`] = sin(t, 1.0, 4, phase);

    vars[`neck_${i}_position_x`] = 0;
    vars[`neck_${i}_position_y`] = 0;
    vars[`neck_${i}_position_z`] = -i * 1.2;
  }

  return vars;
}

function getHeadVariables() {
  const t = getTime();

  return {
    head_rotation_x: sin(t, 1.2, 8),
    head_rotation_y: sin(t, 0.9, 14),
    head_rotation_z: sin(t, 1.0, 6),

    head_position_x: 0,
    head_position_y: 0,
    head_position_z: -7,
  };
}

function getTailVariables() {
  const t = getTime();
  const vars = {};

  for (let i = 1; i <= 12; i++) {
    const phase = i * 0.5;

    vars[`tail_${i}_rotation_x`] = sin(t, 0.8, 4, phase);
    vars[`tail_${i}_rotation_y`] = sin(t, 0.8, 12, phase);
    vars[`tail_${i}_rotation_z`] = sin(t, 0.8, 3, phase);

    vars[`tail_${i}_position_x`] = 0;
    vars[`tail_${i}_position_y`] = 0;
    vars[`tail_${i}_position_z`] = i * 1.3;
  }

  return vars;
}

function getAnimationVariables() {
  return {
    ...getBaseVariables(),
    ...getNeckVariables(),
    ...getHeadVariables(),
    ...getTailVariables(),
  };
}
