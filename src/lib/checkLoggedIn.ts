
const checkLoggedIn = (req: any,res: any, next: any) => {
    if (!res.state.user) {
      res.status = 401; // Unauthorized
      return;
    }
    return next();
  };
  
  export default checkLoggedIn;