export class MutationError extends Error {
  public errorCode?: string
  public errorStatus?: number

  constructor(message: string, errorCode?: string, errorStatus?: number) {
    super(message)
    this.name = 'MutationError'
    this.errorCode = errorCode
    this.errorStatus = errorStatus
  }
}
