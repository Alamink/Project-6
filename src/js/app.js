
App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productYear: 0,
    productPrice: 0,
    partnerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log("reading has set things up\n",
           "sku "+ App.sku +"\n",
            "Upc "+App.upc+"\n",
           "woner " +App.ownerID+"\n", 
            App.originFarmerID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        console.log("Alamin: finding the right web3");
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            console.log("Alamin: it is used ethereum to connect web3");
            try {
                // Request account access
                await window.ethereum.enable();
                console.log("enabled ethereum");

            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
            console.log("Alamin: it is used web3 as current provider");
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            console.log("Alamin: it is used Ganache or tuffle as fallback");
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
            console.log("Alamin: connected with tuffle");
            console.log("Alamin: ", App.web3Provider );
        }
        App.getMetaskAccountID();

        return App.initSupplyChain();
    },
    
    
    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);
        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log("the number of accounts is "+res.length)
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];
            console.log('getMetaskAccountID \'alamin\':',res[0]);
        })
    },
    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('alamin data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
            App.fetchEvents();
            
        });

        return App.bindEvents();
    },
  
    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();
        App.getMetaskAccountID();
        App.readForm();
        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);
        var instance = await App.contracts.SupplyChain.deployed();

        switch(processId) {
            case 0: 
            console.log(" you want to plant item as farmer");
            return await App.plantedItem(event);
            break;
            case 1:
                return await App.harvestItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.packItem(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            case 5:
                return await App.buyItem(event);
                break;
            case 6:
                return await App.shipItem(event);
                break;
            case 7:
                return await App.receiveItem(event);
                break;
            case 8:
                break;
            case 9:
                return await App.fetchItemBufferOne(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            case 11:
                var accountSelected = $("#roleForAccountSelected").val()
                console.log("you want to assign farmer to ID = "+accountSelected);
                return await instance.addFarmer(accountSelected, {from: App.ownerID});
                break;
            case 12:
                    var accountSelected = $("#roleForAccountSelected").val()
                    console.log("you want to assign partner to ID = "+accountSelected);
                    return await instance.addPartner(accountSelected, {from: App.ownerID});                
                break;
            case 13:
                    var accountSelected = $("#roleForAccountSelected").val()
                    console.log("you want to assign consumer to ID = "+accountSelected);
                    return await instance.addConsumer(accountSelected, {from: App.ownerID});
                break;
            case 14:
                 var accountSelected = $("#roleForAccountSelected").val()
                console.log("you want to assign check roles for ID = "+accountSelected);
                console.log("does have farmer ID? " + await instance.isFarmer(accountSelected));
                console.log("does have partner ID? "+ await instance.isPartner(accountSelected))
                console.log("does have consumer ID? "+ await instance.isConsumer(accountSelected))
                break;
            }
    },

    plantedItem: async function(event){
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var instance = await App.contracts.SupplyChain.deployed();
         await instance.plantedItem(App.upc,App.metamaskAccountID,App.originFarmName,
            App.originFarmInformation,App.originFarmLatitude,App.originFarmLongitude,
            App.productNotes, App.productYear)
    },

    harvestItem: async function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var instance = await App.contracts.SupplyChain.deployed();
        await instance.harvestItem(App.upc);
    },
    shipItem: async function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var instance = await App.contracts.SupplyChain.deployed();
         await instance.shipItem(App.upc);
    },

    receiveItem: async function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var instance = await App.contracts.SupplyChain.deployed();
        await instance.receiveItem(App.upc);
    },
    processItem: async function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var instance = await App.contracts.SupplyChain.deployed();
        var result =  await instance.processItem(App.upc);
         $("#ftc-item").text(result);
         console.log('processItem',result);
    },
    packItem: async function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        var instance = await App.contracts.SupplyChain.deployed();
        var result =  await instance.packItem(App.upc);
         $("#ftc-item").text(result);
         console.log('processItem',result);

    },
    sellItem: async function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        // web3 = new Web3(App.web3Provider);

        const productPrice = web3.toWei($("#productPrice").val(), "ether");
        console.log('productPrice',productPrice);
        var instance = await App.contracts.SupplyChain.deployed();
        var result =  await instance.sellItem(App.upc, productPrice);
         $("#ftc-item").text(result);
         console.log('processItem',result);
    },

    buyItem: async function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        const walletValue = web3.toWei("3", "ether");
        console.log('walletValue',walletValue);
        var instance = await App.contracts.SupplyChain.deployed();
        var result =  await instance.buyItem(App.upc, {value: walletValue});
         $("#ftc-item").text(result);
         console.log('processItem',result);

    },
    fetchItemBufferOne: async function () {
       event.preventDefault();
        App.upc = $('#upc').val();
        console.log('upc',App.upc);
        var instance = await App.contracts.SupplyChain.deployed();
        $("#ftc-items").text(await instance.fetchItemBufferOne(App.upc));
        console.log('fetchItemBufferOne', await instance.fetchItemBufferOne(App.upc));
    },

    fetchItemBufferTwo: async function () {
        event.preventDefault();
        App.upc = $('#upc').val();
        console.log('upc',App.upc);
        var instance = await App.contracts.SupplyChain.deployed();
        $("#ftc-items").text(await instance.fetchItemBufferTwo(App.upc));
        console.log('fetchItemBufferOne', await instance.fetchItemBufferTwo(App.upc));
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
