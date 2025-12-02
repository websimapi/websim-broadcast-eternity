export const SAVE_PREFIX = ":::BROADCAST_DATA:::";

export async function loadGameFromComments() {
  try {
    const project = await window.websim.getCurrentProject();
    if (!project) return null;

    // Fetch comments
    const response = await fetch(`/api/v1/projects/${project.id}/comments?sort_by=newest`);
    const data = await response.json();
    const comments = data.comments.data;

    // Find the most recent comment that looks like a save file
    for (const comment of comments) {
      if (comment.raw_content && comment.raw_content.includes(SAVE_PREFIX)) {
        try {
          // Extract JSON from between the markers
          const jsonStr = comment.raw_content.split(SAVE_PREFIX)[1].split(":::")[0];
          const savedState = JSON.parse(jsonStr);
          return savedState;
        } catch (e) {
          console.error("Found save header but failed to parse:", e);
          continue;
        }
      }
    }
    return null;
  } catch (err) {
    console.error("Error loading save:", err);
    return null;
  }
}

export async function saveGameToComment(gameState, screenshotBlob) {
  try {
    const jsonStr = JSON.stringify(gameState);
    const content = `BROADCAST ARCHIVE\n\n${SAVE_PREFIX}${jsonStr}:::`;

    let imageUrls = [];
    if (screenshotBlob) {
      try {
        const url = await window.websim.upload(screenshotBlob);
        imageUrls.push(url);
      } catch (uploadErr) {
        console.error("Failed to upload broadcast clip:", uploadErr);
      }
    }

    await window.websim.postComment({
      content: content,
      images: imageUrls
    });
    return true;
  } catch (err) {
    console.error("Error saving game:", err);
    return false;
  }
}