export const createNewComment = (commentText) => {
  return {
    author: "Warga (Anonymous)",
    text: commentText.trim(),
    time: new Date().toISOString().replace('T', ' ').substring(0, 16)
  }
}