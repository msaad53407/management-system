export async function GET(req: Request) {
  console.log(
    "Hello This API Route responds to a CRON Job from https://cron-job.org"
  );

  return new Response("Hello World");
}
