export interface User {
  email: string;
  id: string;
  role: string;
}

export class UserHelper {
  user: User;
  setUser(user: User) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
