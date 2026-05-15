 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EHRContract {
    struct FileRecord {
        string filename;
        string fileHash;
        string owner;
        uint256 timestamp;
    }

    mapping(string => FileRecord) private fileRecords;

    function addFileRecord(string memory filename, string memory fileHash, string memory owner) public {
        fileRecords[fileHash] = FileRecord(filename, fileHash, owner, block.timestamp);
    }

    function getFileRecord(string memory fileHash) public view returns (string memory, string memory, uint256) {
        FileRecord memory record = fileRecords[fileHash];
        return (record.filename, record.owner, record.timestamp);
    }
}
