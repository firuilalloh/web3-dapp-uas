# UAS Pemrograman Web3 DApp
### Get ABI & Contract Address
- Buka remix IDE dan copas code yang sudah di sediakan.
```solidity
// DonationContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DonationContract {
    struct Donor {
        address addr;
        uint256 amount;
    }

    Donor[] public donors;
    uint256 public totalDonations;

    event DonationReceived(address indexed donor, uint256 amount);

    function donate() public payable {
        require(msg.value > 0, "Donation must be greater than 0");

        donors.push(Donor(msg.sender, msg.value));
        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value);
    }

    function getDonorCount() public view returns (uint256) {
        return donors.length;
    }
}
```
- kemudian klik compile dan tunggu hingga selesai jika sudah ambil Contract ABI yang ada di pojok kanan bawah sidebar.
- lalu pergi ke menu Deploy & Run Transaction ganti Spolia-testnet pada field Environment setelah itu klik Deploy & Verify.
- Scroll ke bawah utnuk menemukan Deployed Contracts copy Contract Address.
### Langkah Instalasi Backend
- lakukan pnpm init untuk menambahkan file package.json
- kemudian install cors dan express
```
pnpm add cors
pnpm add express
```
- kemudian tambahkan command pastikan sudah install global nodemon kalian.
```
"dev":"nodemon server.js"
```
- lalu buat file server.js untuk membuat API nya.
- setelah itu jalankan program menggunakan command.
```
pnpm run dev
```
### Langkah Instalasi Frontend
- Buka terminal, kemudian buat folder frontend pastikan untuk penamaan folder tidak menggunakan kapital.
- Lalu ekseskusi promt ini di sini saya menggunakan CRA (Create React App).
```
npx create-react-app .
```
- Setelah itu instal library ethers.js
```
npm i ethers
```
- Buat file KeyContracts.js untuk wadah Contract Abi & Contract Address
- Lalu buat WalletConnections.js untuk handle function koneksi wallet metamask dan funtion donate
- Buat juga file "BalanceDisplay.js" untuk menampilkan t yang terlah di lakukan, "TransactionList.js" untuk menampilkan history donasi total donasiang telah di lakukan dan menampilkan data dummy dari backend