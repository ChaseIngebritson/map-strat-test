function includesCoords (haystack, needle) {
  return haystack.find(item => item[0] === needle[0] && item[1] === needle[1])
}

export { includesCoords }