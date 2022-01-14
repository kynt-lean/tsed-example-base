import { isObject } from "../../utils";
import { ReadPacket, Serializer } from "../interfaces";
import { RmqRecord } from "../record-builders";

export class RmqRecordSerializer
  implements Serializer<ReadPacket, ReadPacket & Partial<RmqRecord>>
{
  serialize(packet: ReadPacket | any): ReadPacket & Partial<RmqRecord> {
    if (
      packet?.data &&
      isObject(packet.data) &&
      packet.data instanceof RmqRecord
    ) {
      const record = packet.data as RmqRecord;
      return {
        ...packet,
        data: record.data,
        options: record.options,
      };
    }
    return packet;
  }
}