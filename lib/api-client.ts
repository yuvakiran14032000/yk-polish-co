export type PreparedEnquiry = {
  url: string;
  message: string;
  reference: string | null;
  saved: boolean;
  token?: string;
  error?: string;
};
export async function responseJson<T>(
  response: Response,
): Promise<T & { error?: string }> {
  return (await response.json()) as T & { error?: string };
}
