export default class CustomAPI_Error extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}
