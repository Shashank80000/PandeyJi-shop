import dns from "node:dns";

dns.resolveSrv(
  "_mongodb._tcp.cluster0.glvkdth.mongodb.net",
  (err, records) => {
    if (err) {
      console.error(err);
    } else {
      console.log(records);
    }
  }
);
