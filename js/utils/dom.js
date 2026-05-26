export const $ = (id) =>
    document.getElementById(id);
  
  export const on = (
    id,
    event,
    handler
  ) => {
    const el = $(id);
  
    if (el) {
      el.addEventListener(
        event,
        handler
      );
    }
  };