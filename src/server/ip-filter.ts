export const createIpFilter = ({
  sessionLength,
  countRequests,
}: {
  sessionLength: number; // In ms
  countRequests: number;
}) => {
  const cache: Map<string, {
    begin: number; // start session [timestamp]
    updated: number; // current (update) time [timestamp]
    count: number; // counte request in current session
  }> = new Map();

  const log = (ip?: string) => {
    if (ip) {
      if (cache.has(ip) === false) {
        cache.set(ip, { begin: 0, updated: 0, count: 0 });
      }

      const ipFilter = cache.get(ip);

      if (ipFilter.begin === 0) ipFilter.begin = new Date().getTime();
      ipFilter.updated = new Date().getTime();
      ipFilter.count += 1;

      if (ipFilter.updated - ipFilter.begin >= sessionLength) {
        ipFilter.begin = 0;
        ipFilter.count = 0;
      }

      if (ipFilter.count > countRequests) {
        throw new Error("Maximum count requests");
      }

      return true;
    }

    return null;
  };

  return { cache, log };
};