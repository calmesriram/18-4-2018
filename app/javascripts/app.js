// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import bank_artifacts from '../../build/contracts/Bank.json'


// MetaCoin is our usable abstraction, which we'll use through the code below.
var Bank = contract(bank_artifacts);


// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    Bank.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.basicfunctions();
      self.bank_list();
      self.loan_list();
      self.get_loan_list();
      self.fixed_list();
      self.fixed_loan_list();
      self.bank_d1();
      self.bank_listcopy1();
      self. bank_listcopy2();
      self.dues();
    //  self.token_list();
    //  self.get_token_list();
    });
    this.showBalance();

  $("#deposit-bank").click(function(event) {

    var self = this;

    var deposit_amount = parseInt(document.getElementById("deposit-amount").value);

    $("#status").html("Initiating transaction... (please wait)");

    Bank.deployed().then(function(instance) {
      console.log(web3.toWei(deposit_amount, 'ether'));
      return instance.deposit({from: account, gas: 6000000, value: web3.toWei(deposit_amount, 'ether')});
    }).then(function() {
      $("#status").html("Transaction complete!");
    //  if( $("#status").html("Transaction complete!") == null && $("#status").html("Transaction complete!") =="")
   //  {
      window.location.reload();
    // }

      App.showBalance();
    }).catch(function(e) {
      console.log(e);
      $("#status").html("Error in transaction; see log.");
    });
  });

  $("#withdraw").click(function(event) {

    var self = this;

    var withdraw_amount = parseInt(document.getElementById("withdraw-amount").value);

    $("#status").html("Initiating transaction... (please wait)");

    Bank.deployed().then(function(instance) {
      console.log(web3.toWei(withdraw_amount, 'ether'));
      return instance.withdraw(web3.toWei(withdraw_amount, 'ether'),{from: account, gas: 6000000, });
    }).then(function() {
      $("#status").html("Transaction complete!");
      App.showBalance();
    }).catch(function(e) {
      console.log(e);
      $("#status").html("Error in transaction; see log.");
    });
  });
  $("#transfer-amount").click(function(event) {

    var self = this;
    var transfer_address = $("#t").val().trim();
    var transfer_amount = parseInt(document.getElementById("t1").value);

    $("#status").html("Initiating transaction... (please wait)");

    Bank.deployed().then(function(instance) {
      console.log(transfer_address);
      console.log(web3.toWei(transfer_amount, 'ether'));
      return instance.transfer(transfer_address,web3.toWei(transfer_amount, 'ether'),{from: account, gas: 6000000});
    }).then(function() {
      $("#status").html("Transaction complete!");
      App.showBalance();
    }).catch(function(e) {
      console.log(e);
      $("#status").html("Error in transaction; see log.");
    });
  });


  $("#de-register").click(function(event) {

    var self = this;

    $("#status").html("Initiating transaction... (please wait)");

    Bank.deployed().then(function(instance) {
      return instance.deregister({from: account, gas: 6000000});
    }).then(function() {
      $("#status").html("Transaction complete!");
      App.showBalance();
    }).catch(function(e) {
      console.log(e);
      $("#status").html("Error in transaction; see log.");
    });
  });

  $("#token-address").click(function(event) {

    var self = this;

    var tokenaddress = document.getElementById("tokenadd").value;

    $("#status").html("Initiating transaction... (please wait)");
    Bank.deployed().then(function(instance) {
      return instance.tok_count(tokenaddress,{from: account, gas: 6000000});
    }).then(function() {
      $("#status").html("Transaction complete!");
      App.showBalance();
    }).catch(function(e) {
      console.log(e);
      $("#status").html("Error in transaction; see log.");
    });
  });




  $("#register-bank").click(function(event) {

    var self = this;

    var interest = document.getElementById("interest").value * 100;
    var loan_interest = document.getElementById("loan-interest").value * 100;
    var deposit_interest = document.getElementById("deposit-interest").value * 100;
    var bank_name = document.getElementById("bkname").value;

 

    $("#status").html("Initiating transaction... (please wait)");
    
    Bank.deployed().then(function(instance) {
      return instance.register(bank_name, loan_interest, deposit_interest, interest, {from: account, gas: 6000000});
    }).then(function() {
      $("#status").html("Transaction complete!");
      window.location.reload();
      App.showBalance();
    }).catch(function(e) {
      console.log(e);
      $("#status").html("Error in transaction; see log.");
    });
  });
  },

  
  basicfunctions : function(){
    $("#account").val(account)
    web3.eth.getBalance(account, (err, balance) => {
      balance = web3.fromWei(balance, "ether") + " Ξ"
      $("#balance").val(balance.trim())
    });
    },

  showBalance: function() {
    var self = this;

    var bank;
    
    Bank.deployed().then(function(instance) {
      bank = instance;
      return instance.isRegistered(account);
    }).then(function(val) {
      console.log(val);
      if (val == true) {
        $("#reg_bank").html('');
        $("#bank-info").html("This bank has registered");
      } else {
        $("#bank-info").html("This bank has not registered yet");
      }
      return bank.fetchBalance(account);
    }).then(function(val) {
      $("#balance-address").html("This bank's balance is " + web3.fromWei(val, "ether") + " Ξ");
    }).catch(function(e) {
      console.log(e);
    });
  },
  bank_d1 : function(){
    var self = this;

    var bank;
    Bank.deployed().then(function(instance) {
      bank = instance;
      return instance.bank_d1(account);
    }).then(function(val) {
      
      document.getElementById('bankname').value = val[0];
    });
  },
  bank_list : function(){
    var self = this;

    var bank;

    $("#bank_list").html('');
    $("#bank_list").append('<table class="table table-striped"><thead><tr><th>Bank Address</th><th>Bank Name</th><th>Token Count</th><th>Balance</th><th>Borrow Amount</th><th>Lend Amount</th><th>Fixed Amount(Bank)</th><th>Fixed Amount(User)</th><th>Loan Int.</th><th>Fixed Int.</th><th>Deposite Int.</th></tr></thead><tbody id="body_bank"></tbody></table>');
    
    Bank.deployed().then(function(instance) {
      bank = instance;
      return instance.show_registers();
    }).then(function(val) {
       $.each(val,function(err,data){
        bank.bank_d1(data).then(function(result){
           if(result[0]!=" ")
                   $("#body_bank").append('<tr><td>'+data+'</td><td>'+result[0]+'</td><td>'+result[6]+'</td><td>'+web3.fromWei(result[1].toNumber(), "ether")+" Ξ"+'</td><td>'+web3.fromWei(result[7].toNumber(), "ether")+" Ξ"+'</td><td>'+web3.fromWei(result[8].toNumber(), "ether")+" Ξ"+'</td><td>'+web3.fromWei(result[9].toNumber(), "ether")+" Ξ"+'</td><td>'+web3.fromWei(result[10].toNumber(), "ether")+" Ξ"+'</td><td>'+(result[3]/100)+" %"+'</td><td>'+(result[4]/100)+" %"+'</td><td>'+(result[5]/100)+" %"+'</td></tr>')
         
        })
       })
      
    });
  },
  
get_loan : function(){
  var token_address = $("#tkn-address").val();
  var token_count  = parseInt($("#token-count").val());
  var loan_address = $("#loan-address").val().trim();
  var loan_time = parseInt($("#loan-time").val());

  $("#loan-status").html("Initiating transaction... (please wait)");
  
  var self = this;
  var bank;
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.req_loan(token_address,loan_address, token_count ,loan_time,{from:account,gas: 6000000});
  }).then(function(val) {
    $("#loan-status").html("Transaction complete!");
  }).catch(function(e) {
    console.log(e);
    $("#loan-status").html("Error in transaction; see log.");
  });
},
dues : function(){
 
  $("#loan-status").html("Initiating transaction... (please wait)");
  
  var self = this;
  var bank;
  Bank.deployed().then(function(instance) {
    bank = instance;
    
    return bank.loan_due_pending({from:account,gas: 6000000});
     }).then(function(val) {
       document.getElementById('lp').value = val[0];
       document.getElementById('de').value = val[1];
     }).catch(function(e) {
    console.log(e);
    $("#loan-status").html("Error in transaction; see log.");
  });
},

fixed_loan : function(){
  var fixed_amount  = parseInt($("#fixed-amount").val().trim());
  var fixed_address = $("#fixed-address").val().trim();
  var fixed_time = parseInt($("#fixed-time").val().trim());

  $("#loan-status").html("Initiating transaction... (please wait)");
  
  var self = this;
  var bank;
  Bank.deployed().then(function(instance) {
    bank = instance;
    
    return bank.Fixed_Deposit(fixed_address,fixed_time,{from:account,gas: 6000000 ,value: web3.toWei(fixed_amount, 'ether')});
    console.log(fixed_address);
  }).then(function(val) {
    $("#loan-status").html("Transaction complete!");
  }).catch(function(e) {
    console.log(e);
    $("#loan-status").html("Error in transaction; see log.");
  });
},

 //loan request
 bank_listcopy1: function(){
  var self = this;

  var bank;

  $("#bank_listcopy1").html('');
  $("#bank_listcopy1").append('<table class="table table-striped"><thead><tr><th>Bank Address</th><th>Bank Name</th><th>Balance</th><th>Loan Int.</tr></thead><tbody id="body_bank1"></tbody></table>');
  
  Bank.deployed().then(function(instance) {
    bank = instance;
    return instance.show_registers();
  }).then(function(val) {
     $.each(val,function(err,data){
      bank.bank_d1(data).then(function(result){
        if(result[0]!=" ")
        $("#body_bank1").append('<tr><td>'+data+'</td><td>'+result[0]+'</td><td>'+web3.fromWei(result[1].toNumber(), "ether")+" Ξ"+'</td><td>'+(result[3]/100)+" %"+'</td></tr>')
      })
     })
    
  });
},

//fixed deposite
bank_listcopy2 : function(){
  var self = this;

  var bank;

  $("#bank_listcopy2").html('');
  $("#bank_listcopy2").append('<table class="table table-striped"><thead><tr><th>Bank Address</th><th>Bank Name</th><th>Balance</th><th>Fixed Int.</th></tr></thead><tbody id="body_bank2"></tbody></table>');
  
  Bank.deployed().then(function(instance) {
    bank = instance;
    return instance.show_registers();
  }).then(function(val) {
     $.each(val,function(err,data){
      bank.bank_d1(data).then(function(result){
        if(result[0]!=" ")
        $("#body_bank2").append('<tr><td>'+data+'</td><td>'+result[0]+'</td><td>'+web3.fromWei(result[1].toNumber(), "ether")+" Ξ"+'</td><td>'+(result[4]/100)+" %"+'</td></tr>')
      })
     })
    
  });
},

fixed_list:function(){
  var self = this;
  var bank;
  $("#fixed_list").html('')
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.bank_client_count(account);
  }).then(function(val) {
      for(var i=0;i<val.toNumber();i++)
      {
        bank.bank_owner_clients(account,i).then(function(valu,err){
          bank.bank_client_Details(account,valu).then(function(data,err){
            var myDate = new Date( (data[4].toNumber()) *1000);
            var a=(myDate.toLocaleString());
            var stus;
            if(data[6])
            {
              stus="Not Settled";
              $("#fixed_list").append('<tr><td>'+data[1]+'</td><td>'+web3.fromWei(data[2].toNumber(), "ether")+ " Ξ"+'</td><td>'+a.split(',')[0]+'</td><td>'+stus+'</td>');
            }
          });
        });
      }
  });
},
/*
loan_list:function(){
  var self = this;
  var bank;
  $("#loan_list").html('')
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.ln_pro_count(account);
  }).then(function(val) {
      for(var i=0;i<val.toNumber();i++){
        bank.ln_pro(account,i).then(function(data,err){
          $("#loan_list").append('<tr><td>'+data[0]+'</td><td>'+web3.fromWei(data[1].toNumber(), "ether")+ " Ξ"+'</td><td>'+data[3]+'</td></tr>');
        });
      }
  });
},*/

loan_list:function(){
  var self = this;
  var bank;
  $("#loan_list").html('')
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.loan_pro_count(account);
  }).then(function(val) {
      for(var i=0;i<val.toNumber();i++){
        bank.loan_pro_id(account,i).then(function(valu,err){
          bank.loan(valu,account).then(function(data,err){
            var myDate = new Date( (data[6].toNumber()) *1000);
            var a=(myDate.toLocaleString());
                  
            var mDate = new Date( (data[7].toNumber()) *1000);
            var b=(mDate.toLocaleString());
            if(data[9] != 0)  
            $("#loan_list").append('<tr><td>'+data[0]+'</td><td>'+data[2]+'</td><td>'+data[3]+'</td><td>'+web3.fromWei(data[4].toNumber(), "ether")+ " Ξ"+'</td><td>'+data[5]+'</td><td>'+a.split(',')+'</td><td>'+b.split(',')+'</td><td>'+web3.fromWei(data[9].toNumber(), "ether")+ " Ξ"+'</td><td>'+data[10]+'</td><td>'+data[12]+'</td></tr>');
        
          });
        });
      }
  });
},


get_loan_list:function(){
  var self = this;
  var bank;
  $("#get_loan_list").html('')
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.loan_get_count(account);
  }).then(function(val) {
      for(var i=0;i<val.toNumber();i++){
        bank.loan_get_id(account,i).then(function(valu,err){
          bank.loan(valu,account).then(function(data,err){
            var myDate = new Date( (data[6].toNumber()) *1000);
            var a=(myDate.toLocaleString());
           if(data[9] != 0)       
            $("#get_loan_list").append('<tr><td>'+data[0]+'</td><td>'+data[1]+'</td><td>'+web3.fromWei(data[4].toNumber(), "ether")+ " Ξ"+'</td><td>'+data[5]+'</td><td>'+a.split(',')+'</td><td>'+data[8]+'</td><td>'+web3.fromWei(data[9].toNumber(), "ether")+ " Ξ"+'</td><td>'+web3.fromWei(data[10].toNumber(), "ether")+ " Ξ"+'</td></tr>');
        
          });
        });
      }
  });
},


fixed_loan_list:function(){
  var self = this;
  var bank;
  $("#fixed_loan_list").html('')
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.my_acc_count(account);
  }).then(function(val) {
      for(var i=0;i<val.toNumber();i++){
        bank.my_acc_details(account,i).then(function(valu,err){
          bank.bank_client_Details(valu,account).then(function(data,err){
            var myDate = new Date( (data[4].toNumber()) *1000);
            var a=(myDate.toLocaleString());
            var stus;
            if(data[6])
            {
              stus="Not Settled"
              $("#fixed_loan_list").append('<tr><td>'+data[0]+'</td><td>'+web3.fromWei(data[2].toNumber(), "ether")+ " Ξ"+'</td><td>'+a.split(',')[0]+'</td><td>'+data[5]+'</td><td>'+stus+'</td>'); 
            }
          });
        });
      }
  });
},
pay_due:function(){
  var id = parseInt($("#Loan_id").val().trim());
  var self = this;
  var bank;
  $("#status").html("Initiating transaction... (please wait)");
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.settlement(id,{from:account,gas: 6000000});
  }).then(function() {
    $("#status").html("Transaction complete!");
  }).catch(function(e) {
    console.log(e);
    $("#status").html("Error in transaction; see log.");
  });
},
fix_req:function(){
  var bank_addr = $("#bank-fix-address").val().trim();
  var self = this;
  var bank;
  $("#fix-req-status").html("Initiating transaction... (please wait)");
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.fixed_amount_get(bank_addr,{from:account,gas: 6000000});
  }).then(function() {
    $("#fix-req-status").html("Transaction complete!");
  }).catch(function(e) {
    console.log(e);
    $("#fix-req-status").html("Error in transaction; see log.");
  });
},
/*
get_token : function(){
  var amount  = parseInt($("#token-value").val().trim());
  var bank_address = $("#bank-address").val().trim();
  var token_address = $("#token-address").val().trim();
  var year = parseInt($("#year").val().trim());

  $("#token").html("Initiating transaction... (please wait)");
  
  var self = this;
  var bank;
  Bank.deployed().then(function(instance) {
    bank = instance;
    //return bank.loan_req_token(token_address,bank_address,year, web3.toWei(amount, 'ether'),{from:account,gas: 6000000});
    return bank.loan_req_token(token_address,bank_address,year,amount,{from:account,gas: 6000000});
  }).then(function(val) {
    $("#token").html("Transaction complete!");
  }).catch(function(e) {
    console.log(e);
    $("#token").html("Error in transaction; see log.");
  });
},


token_list:function(){
  var self = this;
  var bank;
  $("#token_list").html('')
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.tk_pro_count(account);
  }).then(function(val) {
      for(var i=0;i<val.toNumber();i++){
        bank.tk_pro(account,i).then(function(data,err){
          $("#token_list").append('<tr><td>'+data[0]+'</td><td>'+web3.fromWei(data[1].toNumber(), "ether")+ " ?"+'</td><td>'+data[3]+'</td></tr>'+data[4]+'</td></tr>');
        });
      }
  });
},


get_token_list:function(){
  var self = this;
  var bank;
  $("#get_token_list").html('')
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.tk_get_count(account);
  }).then(function(val) {
      for(var i=0;i<val.toNumber();i++){
        bank.tk_get(account,i).then(function(data,err){
        
          //console.log( a.split(',')[0] );
   $("#get_token_list").append('<tr><td>'+data[10]+'</td><td>'+'</td><td>'+web3.fromWei(data[1].toNumber(), "ether")+ " ?"+'</td><td>'+data[8]+'</td><td>'+'</td></tr>'+data[9]);
        });
      }
  });
},

*/


fix_set:function(){
  var user_addr = $("#user-fix-address").val().trim();
  var self = this;
  var bank;
  $("#fix-set-status").html("Initiating transaction... (please wait)");
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.amount_settlement(user_addr,{from:account,gas: 6000000});
  }).then(function() {
    $("#fix-set-status").html("Transaction complete!");
  }).catch(function(e) {
    console.log(e);
    $("#fix-set-status").html("Error in transaction; see log.");
  });
}

};


window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  App.start();
});