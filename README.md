<!--
*** Thanks for checking out this README Template. If you have a suggestion that would
*** make this better, please fork the repo and create a pull request or simply open
*** an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/DickensJuma/Medical-BlockShare">
    <img src="CLI/images/blockchainsharing.jpeg" alt="Logo" width="90" height="80">
  </a>

  <h3 align="center"> Medical-BlockShare</h3>

  <p align="center">
     
 **Medical-BlockShare** is a distributed file sharing system for medical services.
It combines the powers of blockchain technology and the Interplanetary File System.
    <br />
    <a href="https://github.com/DickensJuma/Medical-BlockShare"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/DickensJuma/Medical-BlockShare/issues">Report Bug</a>
    ·
    <a href="https://github.com/DickensJuma/Medical-BlockShare/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
- [Installation](#installation)
  - [Built With](#built-with)
- [Live version](#live-version)
- [Contributor](#contributor)
- [Acknowledgements](#acknowledgements)
- [📝 License](#%f0%9f%93%9d-license)

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](CLI/images/blockShare.png)



## Purpose
The purpose of this Devpost project is to build a ethereum blockchain for storing medical files on the IPFS. network.**Covidathon Hackathon**

## Use case
A medical service (e.g., a general practitioner) owns medical records of his patients. 
Nowadays, to share that data with another medical service, it requires physical file sharing or some other unsafe or slow form of access approval.
Medical-BlockShare uses the IPFS to have a shared, decentralized file system containing all the medical records. 
Access to a medical record can then be requested using a transaction on the blockchain, permission is given likewise.
The use of the blockchain allows the file sharing system to be supervised.

## Features
* The medical records are stored securely using the IPFS.
* A medical record is owned by exactly one person at a time. 
* The owner of the medical record of a patient are by reading the ledger and following the transaction for his/her ID. 
Permission can then be requested by asking the owner of that medical record to transfer the access codes.
* Medical records are stored using the FHIR format (standardised JSON for medical records).

## Implementation(Future)
A website will be provided which illustrates the way medical services can interact with the system.
It shows the medical records of patients managed by a particular medical service. These records will be viewed, and updated.



<!-- ABOUT THE PROJECT -->

## Installation

To run the cli, "cd" into the "CLI" directory, and run

    node automation.js --no-warnings


### Built With

This project was built using these technologies.

- Ethereum
- NodeJs
- Blockchain


<!-- LIVE VERSION -->
## Live version

You can see it working [here](https://youtu.be/nwTkedLooyM)

<!-- CONTACT -->
## Contributor

👤 **Dickens Juma** 
    
- LinkedIn: [Dickens Juma](https://www.linkedin.com/in/dickens-juma-363061182/) 
- GitHub: [@DickensJuma](https://github.com/DickensJuma)
- E-mail: dickensjuma13@gmail.com


👤 **Patrick Nyatindo** 
    
- LinkedIn: [Patrick Nyatindo](https://www.linkedin.com/in/dickens-juma-363061182/) 
- GitHub: [@nyatinopatrick](https://github.com/nyatindopatrick/)
- E-mail: nyatindopatrick@gmail.com

👤 **Cyrus Kiprop** 
    
- LinkedIn: [Cyrus Kiprop](https://www.linkedin.com/in/dickens-juma-363061182/) 
- GitHub: [@Cyrus-Kiprop](https://github.com/Cyrus-Kiprop)
- E-mail: cyruskiprop254@gmail.com





## Show your support

Give a ⭐️ if you like this project!

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [DEVPOST](https://www.devpost.com/)
[![Product Name Screen Shot][acc-screenshot]](CLI/images/DEVPOST.png)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/DickensJuma/Medical-BlockShare.svg?style=flat-square
[contributors-url]: https://github.com/DickensJuma/Medical-BlockShare/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/DickensJuma/Medical-BlockShare.svg?style=flat-square
[forks-url]: https://github.com/DickensJuma/Medical-BlockShare/network/members
[stars-shield]: https://img.shields.io/github/stars/DickensJuma/Medical-BlockShare.svg?style=flat-square
[stars-url]: https://github.com/DickensJuma/Medical-BlockShare/stargazers
[issues-shield]: https://img.shields.io/github/issues/DickensJuma/Medical-BlockShare.svg?style=flat-square
[issues-url]: https://github.com/DickensJuma/Medical-BlockShare/issues
[product-screenshot]: CLI/images/blockShare.png
[acc-screenshot]: CLI/images/DEVPOST.png

## 📝 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.


