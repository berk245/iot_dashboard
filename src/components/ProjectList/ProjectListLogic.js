const searchProject = (projects, keyword) => {
  try {
    let searchResults = projects.filter((project) => {
      return (
        project.name.toLowerCase().includes(keyword.toLowerCase()) ||
        String(project.id).includes(keyword)
      );
    });
    return searchResults;
  } catch {
    return projects;
  }
};

export { searchProject };
