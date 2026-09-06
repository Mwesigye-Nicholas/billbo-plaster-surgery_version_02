const imageTypeToMime: Record<string, string> = {
  "X-ray": "image/jpeg",
  "CT": "image/jpeg",
  "MRI": "image/jpeg",
  "Other": "application/octet-stream",
};
export default imageTypeToMime;