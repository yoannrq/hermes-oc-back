import { ObjectId } from 'bson';

function getTimestampFromMongoObject(mongoObject) {
  return new ObjectId(mongoObject.id).getTimestamp();
}

export default getTimestampFromMongoObject;
