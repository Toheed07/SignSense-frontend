export const BardHello = (ref) => {
  // Ensure we have a clean slate for the animations
  let animations = [];

  // Raise the arm to wave position
  animations.push(["mixamorigSpine", "rotation", "y", Math.PI / 8, "+"]);
  animations.push(["mixamorigRightArm", "rotation", "x", Math.PI / 3, "+"]);
  animations.push(["mixamorigRightArm", "rotation", "z", -Math.PI / 18, "+"]);
  animations.push(["mixamorigRightForeArm", "rotation", "x", -Math.PI / 4, "+"]);

  // Open the hand to a natural waving position (optional, depends on the model)
  animations.push(["mixamorigRightHand", "rotation", "x", Math.PI / 6, "+"]);

  // Push the arm raise animation to the animations array
  ref.animations.push(animations);

  // Animate the wave by rotating at the wrist
  animations = []; // reset for the next sequence

  // Multiple back and forth rotations can be applied to simulate waving
  for (let i = 0; i < 3; i++) { // 3 wave cycles
    animations.push(["mixamorigRightHand", "rotation", "y", Math.PI / 6, "+"]);
    ref.animations.push(animations);
    animations = []; // keyframe reset
    animations.push(["mixamorigRightHand", "rotation", "y", -Math.PI / 6, "-"]);
    ref.animations.push(animations);
    animations = []; // keyframe reset for next cycle
  }

  // Return arm to the side
  animations.push(["mixamorigSpine", "rotation", "y", -Math.PI / 8, "-"]);
  animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3, "-"]);
  animations.push(["mixamorigRightArm", "rotation", "z", Math.PI / 18, "-"]);
  animations.push(["mixamorigRightForeArm", "rotation", "x", Math.PI / 4, "-"]);
  animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI / 6, "-"]);

  // Push the arm return animation to the animations array
  ref.animations.push(animations);

  // Start the animation if not already playing and mark it as pending
  if (!ref.pending) {
    ref.pending = true;
    ref.animate();
  }
}
