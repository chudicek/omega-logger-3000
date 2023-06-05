export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'HIGH':
      return 'bg-dark-red';
    case 'MEDIUM':
      return 'bg-light-orange';
    case 'LOW':
      return 'bg-default-green';
    default:
      return 'bg-light-grey';
  }
};

export const getStateColor = (state: string) => {
  switch (state) {
    case 'TODO':
      return 'bg-light-grey';
    case 'SENT_FOR_REVIEW':
      return 'bg-light-orange';
    case 'DONE':
      return 'bg-default-green';
    default:
      return 'bg-light-grey';
  }
};
