import axios from "axios";

async function retryReq(resource, times = 3) {
  for (let i = 0; i < times; i++) {
    try {
      const res = await axios(resource);
      return res.data;
    } catch (err) {
      console.log(`Failed to retrieve the resource (${JSON.stringify(err.response)}).`);
      if (i < times - 1) {
        console.log(`Retrying ${i + 1}/${times}...`);
      } else {
        throw err;
      }
    }
  }
}

async function getIsDone(resource, extractor) {
  return extractor(await retryReq(resource));
}

let totalIsDone = 0;
// not necessarily endpoints.length - totalIsDone, take errors into account
let totalNotIsDone = 0;

export async function getIsDoneForAll(resourceMap, extractorMap) {
  for (const [type, resources] of resourceMap) {
    for (const resource of resources) {
      console.log(`Trying ${resource}...`);
      try {
        const isDone = await getIsDone(resource, extractorMap.get(type));
        if (isDone) {
          totalIsDone++;
        } else {
          totalNotIsDone++;
        }
        console.log(`isDone=${isDone} for ${resource}`);
      } catch (err) {
        console.log(`Excluding endpoint (${err.response})`);
      }
    }
  }
  console.log(`Total trues ${totalIsDone}`);
  console.log(`Total falses ${totalNotIsDone}`);
}
