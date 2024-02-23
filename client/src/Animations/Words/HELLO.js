export const SALUTE_ANIMATION = (ref) => {
    let animations = [];

    // Reset all parts to their default positions
    animations.push(["mixamorigLeftHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandIndex2", "rotation", "z", 0, "+"]);
    // ... (Reset other hand parts and body parts as needed)

    // Initial pose
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/3.5, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "y", Math.PI/9, "+"]);
    // ... (Define initial pose for other parts)

    // Open fist
    animations.push(["mixamorigLeftHand", "rotation", "x", Math.PI/2, "+"]);

    // Move hand near the head
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI/2, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "y", -Math.PI/4, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", Math.PI/2, "-"]);

    // Salute position
    animations.push(["mixamorigLeftHand", "rotation", "x", 0, "-"]);

    // Get hand away
    animations.push(["mixamorigLeftArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);

    ref.animations.push(animations);

    // Trigger the animation
    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};
