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

export async function saveGameToComment(gameState) {
  try {
    const jsonStr = JSON.stringify(gameState);
    const content = `BROADCAST ARCHIVE\n\n${SAVE_PREFIX}${jsonStr}:::`;

    // We can assume tape_icon.png is uploaded or just reference it if it was a blob.
    // Since we can't easily get the blob URL of the asset generated here in a simple script,
    // we will just post the text content. The game is the clip.

    await window.websim.postComment({
      content: content
    });
    return true;
  } catch (err) {
    console.error("Error saving game:", err);
    return false;
  }
}