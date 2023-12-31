import * as bcrypt from "bcrypt";

class User {
  constructor(public username: string, public password: string) {}
}

class userAuth {
  private users: { username: string; password: string }[];

  constructor() {
    this.users = [];
  }

  // Hash a password
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  // Register a new user with a hashed password
  async registerUser(username: string, password: string): Promise<string | void> {
    // Check if the username already exists
    const usernameExists = this.usernameExists(username);

    if (usernameExists) {
      return "Username is already taken. Please choose a different username.";
    }

    const hashedPassword: string = await this.hashPassword(password);
    const user = new User(username, hashedPassword);
    this.users.push(user);
  }

  // Verify a password
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Authenticate a user
  async authenticate(username: string, password: string): Promise<string> {
    // Object with user data, or undefined if it doesn't exists
    const user = this.getUserByUsername(username);

    // If user doesn't exists, return
    if (!user) return "Authentication failed. Please check your username and password.";

    const passMatch = await this.verifyPassword(password, user.password);

    if (passMatch) {
      return "You can successfully log in.";
    } else {
      return "Authentication failed. Please check your username and password.";
    }
  }

  // Check if a username already exists
  usernameExists(username: string): boolean {
    return this.users.some((user) => user.username === username);
  }

  // Get user by username
  getUserByUsername(username: string): { username: string; password: string } | undefined {
    return this.users.find((user) => user.username === username);
  }

  // Remove a user by username (for account deletion)
  removeUserByUsername(username: string): void {
    this.users = this.users.filter((user) => user.username !== username);
  }
}

// Example usage:

const userList = new userAuth();

(async () => {
  // Register a few users
  await userList.registerUser("user1", "password1");
  await userList.registerUser("user2", "password2");
  await userList.registerUser("user3", "password3");

  // Register existing username
  console.log(await userList.registerUser("user1", "randompass")); // Username taken

  // Print userList
  console.log(userList);

  // Authenticate
  console.log(await userList.authenticate("user1", "password1")); // Successful login
  console.log(await userList.authenticate("user1", "wrongpassword")); // Failed login

  // Find if username exists
  console.log(userList.usernameExists("user2")); // true

  // Get a user
  console.log(userList.getUserByUsername("user3"));

  // Remove user
  userList.removeUserByUsername("user3");
  console.log(userList); // Removed user3
})();

export {};
