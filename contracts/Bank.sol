pragma solidity^0.4.0;
contract ERC20  
{
  function allowance(address owner, address spender) public view returns (uint256);
  function transferFrom(address from, address to, uint256 value) public returns (bool);
  function approve(address spender, uint256 value) public returns (bool);
  event Approval(address indexed owner, address indexed spender, uint256 value);
  function totalSupply() public view returns (uint256);
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}


contract Bank 
{
    
    //Register contract Details
    struct bank_Details
    {
        string name;
        uint bal;
        uint time;
        uint loan_interst;
        uint fixed_deposit_interst;
        uint account_deposit_interst;
        uint token_count;
        uint borrow_amount;
        uint lend_amount;
        uint fixed_amount_bank;
        uint fixed_amount_user;
        bool status;
    }
    
    mapping(address => bank_Details) public bank_d1;
    address[] public reg_user;
    
    
    //Loan_Details contract Details
    
    uint loan_count;
    uint eth= 0.01 ether;
    struct loan_details
    {
        uint loan_id;
        address lender_address;
        address borrower_address;
        address token_address;
        uint amount;
        uint settle_count;
        uint next_settle_time;
        uint loan_get_time;
        uint months;
        uint bal_loan;
        uint current_installment;
        uint ins_per_month;
        uint tokens;
        //uint not_pay_count;
    }
    
    mapping(uint => loan_details) public loan;
    //mapping (address => mapping(address => mapping(uint256 => loan_details))) public loan;
    
    mapping(address => mapping(uint => uint)) public loan_get_id;
    mapping(address => uint256) public loan_get_count;
    
    mapping(address => mapping(uint => uint)) public loan_pro_id;
    mapping(address => uint256) public loan_pro_count;

    
    //Fixed_Deposit contract Details
    struct Bank_Client
    {
        address bank_address;
        address user_address;
        uint256 amount;
        uint256 start_time;
        uint256 end_time;
        uint256 year;
        bool check;
    }

    mapping(address => mapping(address => Bank_Client)) public bank_client_Details;

    //Bank can stores the users details
    mapping(address => mapping(uint256 => address)) public bank_owner_clients;
    mapping(address => uint256) public bank_client_count;

    //User can stores the deposited bank details
    mapping(address => mapping(uint256 => address)) public my_acc_details;
    mapping(address => uint256) public my_acc_count;



    //Register contract functions
    function register(string name, uint loan_interst, uint fixed_deposit, uint acc_dep_int) public payable returns(string)
    {
        if(bank_d1[msg.sender].time == 0)
        {
            bank_d1[msg.sender].name = name;
            bank_d1[msg.sender].loan_interst = loan_interst;
            bank_d1[msg.sender].fixed_deposit_interst = fixed_deposit;
            bank_d1[msg.sender].account_deposit_interst = acc_dep_int;
            bank_d1[msg.sender].bal = msg.value;
            bank_d1[msg.sender].time = now;
        
            if(bank_d1[msg.sender].status == false)
            {
                bank_d1[msg.sender].status = true;
                reg_user.push(msg.sender);
            }
            
            return "Successfully Registered";
        }
        else
        {
            return "Account Alreay Exist";
        }
    }

    function deregister() public
    {
        require(bank_d1[msg.sender].time != 0);
        require(bank_d1[msg.sender].borrow_amount == 0);
        require(bank_d1[msg.sender].lend_amount == 0);
        require(bank_d1[msg.sender].fixed_amount_bank == 0);
        require(bank_d1[msg.sender].fixed_amount_user == 0);

        msg.sender.transfer(bank_d1[msg.sender].bal);

        bank_d1[msg.sender].name = " ";
        bank_d1[msg.sender].loan_interst = 0;
        bank_d1[msg.sender].fixed_deposit_interst = 0;
        bank_d1[msg.sender].account_deposit_interst = 0;
        bank_d1[msg.sender].bal = 0;
        bank_d1[msg.sender].time = 0;
    }
  
    function show_registers() public view returns(address[])
    {
        return reg_user;
    }

    
    function show_bank_detail(uint index,uint intr_type)public view returns(string bank_name,address tem_add,uint intr)
    {
        tem_add = reg_user[index];
        bank_name = bank_d1[tem_add].name;
        if(intr_type == 0)
        {
            intr = bank_d1[tem_add].loan_interst;
        }
        if(intr_type == 1)
        {
            intr = bank_d1[tem_add].fixed_deposit_interst;
        }
        if(intr_type == 2)
        {
            intr = bank_d1[tem_add].account_deposit_interst;
        }
    }


    //Bank Contract Basic functions
    modifier ch_register()
    {
        require(bank_d1[msg.sender].time != 0);
        _;
    }
   
    function deposit()  public payable ch_register
    {
        require(msg.value > 0);
        bank_d1[msg.sender].bal += msg.value;
    }
   
    function withdraw(uint256 amount) ch_register public
    {
        require(bank_d1[msg.sender].bal > amount);
        bank_d1[msg.sender].bal -= amount;
        msg.sender.transfer(amount);
    }
   
    function transfer(address to,uint256 amount) ch_register public
    {  
        require(bank_d1[msg.sender].bal > amount);
        bank_d1[to].bal += amount;
        bank_d1[msg.sender].bal -= amount; //amount transfered to other persion bank address
        //to.transfer(amount);
    }
    
    function GetBalance() ch_register public constant returns (uint256)
    {
        return bank_d1[msg.sender].bal;
    }

    function fetchBalance(address _banker) public constant returns (uint256)
    {
        return bank_d1[_banker].bal;
    }

    function isRegistered(address _bank) public constant returns (bool) {
      return bank_d1[_bank].time > 0;
    }




    //Loan_Details contract functions
    
    function req_loan(address token_address,address bank_address,uint256 tokens,uint8 year) public //payable
    {
        require(bank_d1[bank_address].time!=0);
        require(bank_address!=msg.sender);
        
        uint256 amt = (eth * tokens);
        
        require (bank_d1[bank_address].bal > amt );
        
        ERC20(token_address).transferFrom(msg.sender,bank_address,tokens);
        
        bank_d1[bank_address].bal-=amt;
        bank_d1[msg.sender].bal+=amt;
        //msg.sender.transfer(amt);
        
        
        bank_d1[msg.sender].borrow_amount += amt;
        bank_d1[bank_address].lend_amount += amt;

        bank_d1[msg.sender].token_count=ERC20(token_address).balanceOf(msg.sender);
        bank_d1[bank_address].token_count=ERC20(token_address).balanceOf(bank_address);

        uint intr = bank_d1[bank_address].loan_interst;
        uint amont = ( amt * (intr/100) ) /100;
        
        loan_get_id[msg.sender][ loan_get_count[msg.sender] ] = loan_count;
        loan_get_count[msg.sender]++;
        loan_pro_id[bank_address][ loan_pro_count[bank_address] ] = loan_count;
        loan_pro_count[bank_address]++;
        
        
        loan[loan_count].loan_id = loan_count;
        loan[loan_count].lender_address = bank_address;
        loan[loan_count].borrower_address = msg.sender;
        loan[loan_count].token_address = token_address;
        loan[loan_count].amount = amt;
        loan[loan_count].next_settle_time = now + 2 minutes;//35 days;
        loan[loan_count].loan_get_time = now;
        loan[loan_count].months = year*12;
        loan[loan_count].bal_loan = amt;
        loan[loan_count].current_installment = amont + ((amt)/(year*12));
        loan[loan_count].ins_per_month = (amt)/(year*12);
        loan[loan_count].tokens = tokens;
        
        loan_count++;
    }
    
    function settlement(uint ln_id) public
    {
        uint intr;
        uint amont;
        
        require(loan[ln_id].borrower_address == msg.sender);
        
        require(loan[ln_id].settle_count <= loan[ln_id].months);
         
        if(loan[ln_id].settle_count < loan[ln_id].months)
        {
            require( now > (loan[ln_id].next_settle_time - 1 minutes  /* 5 days */)) ;
            
            if( ((loan[ln_id].next_settle_time - 1 minutes  /* 5 days */) <= now) && (now <= loan[ln_id].next_settle_time))
            {
                require( loan[ln_id].current_installment <= bank_d1[msg.sender].bal);
        
                bank_d1[msg.sender].bal -= loan[ln_id].current_installment;
                bank_d1[ loan[ln_id].lender_address ].bal += loan[ln_id].current_installment;

                bank_d1[msg.sender].borrow_amount -= loan[ln_id].ins_per_month;
                bank_d1[ loan[ln_id].lender_address ].lend_amount -= loan[ln_id].ins_per_month;
                loan[ln_id].bal_loan -= loan[ln_id].ins_per_month;
        
                intr = bank_d1[ loan[ln_id].lender_address ].loan_interst;
                amont = ( (loan[ln_id].bal_loan) * (intr/100) ) /100;
                loan[ln_id].current_installment = amont + loan[ln_id].ins_per_month;
                
                loan[ln_id].next_settle_time += 1 minutes;//30 days;
        
                loan[ln_id].settle_count++;
            }

            else
            {
                require( (loan[ln_id].current_installment + 0.01 ether) <= bank_d1[msg.sender].bal);
        
                bank_d1[msg.sender].bal -= (loan[ln_id].current_installment + 0.01 ether);
                bank_d1[ loan[ln_id].lender_address ].bal += (loan[ln_id].current_installment + 0.01 ether);

                bank_d1[msg.sender].borrow_amount -= loan[ln_id].ins_per_month;
                bank_d1[ loan[ln_id].lender_address ].lend_amount -= loan[ln_id].ins_per_month;
                loan[ln_id].bal_loan -= loan[ln_id].ins_per_month;
        
                intr = bank_d1[ loan[ln_id].lender_address ].loan_interst;
                amont = ( (loan[ln_id].bal_loan) * (intr/100) ) /100;
                loan[ln_id].current_installment = amont + loan[ln_id].ins_per_month;
                
                loan[ln_id].next_settle_time += 1 minutes;// 30 days;
        
                loan[ln_id].settle_count++;
            }
        }

        else if(loan[ln_id].settle_count == loan[ln_id].months)
        {

            bank_d1[msg.sender].bal -= loan[ln_id].bal_loan;
            bank_d1[ loan[ln_id].lender_address ].bal += loan[ln_id].bal_loan;

            bank_d1[msg.sender].borrow_amount -= loan[ln_id].bal_loan;
            bank_d1[ loan[ln_id].lender_address ].lend_amount -= loan[ln_id].bal_loan;
            loan[ln_id].bal_loan -= loan[ln_id].bal_loan;

            ERC20( loan[ln_id].token_address ).transferFrom( loan[ln_id].lender_address , msg.sender, loan[ln_id].tokens);
        }
    }

    function loan_due_pending() public view returns(uint,uint)
    {
        uint temp_id;
        uint temp_bending_count;
        uint temp_exp_count;
        
        for(uint i = 0; i < loan_get_count[msg.sender]; i++)
        {
            temp_id = loan_get_id[msg.sender][i];
            if( now >= (loan[temp_id].next_settle_time - 1 minutes  /* 5 days */))
            {
                if( ((loan[temp_id].next_settle_time - 1 minutes  /* 5 days */) <= now) && (now <= loan[temp_id].next_settle_time))
                {
                    if(loan[temp_id].bal_loan > 0)
                        temp_bending_count++;
                }
                else
                {
                    if(loan[temp_id].bal_loan > 0)
                        temp_exp_count++;
                }
            }
        }
        return (temp_bending_count,temp_exp_count);
    }
    
    
    function balanceOftoken(address token) public view returns(uint)
    {   
        return ERC20(token).balanceOf(msg.sender);
    }
    
    
    function tok_count(address token) public
    {
        bank_d1[msg.sender].token_count = ERC20(token).balanceOf(msg.sender);
    }



    //Fixed_Deposit contract functions
    
    function Fixed_Deposit(address bank_addr, uint256 year) public payable
    {
        require(bank_d1[bank_addr].time != 0);
        
        require( bank_client_Details[bank_addr][msg.sender].check == false );
        require(bank_addr != msg.sender);
        bank_client_Details[bank_addr][msg.sender].bank_address = bank_addr;
        bank_client_Details[bank_addr][msg.sender].user_address = msg.sender;
        bank_owner_clients[bank_addr][ bank_client_count[bank_addr] ] = msg.sender;
        
        my_acc_details[msg.sender][ my_acc_count [msg.sender] ] = bank_addr;
        
        if(bank_client_Details[bank_addr][msg.sender].amount == 0)
        {
            bank_client_count[bank_addr]++;
            my_acc_count[msg.sender]++;
        }
        
        bank_d1[bank_addr].bal += msg.value;
        bank_d1[bank_addr].fixed_amount_bank += msg.value;
        bank_d1[msg.sender].fixed_amount_user += msg.value;
        
        bank_client_Details[bank_addr][msg.sender].amount = msg.value;
        bank_client_Details[bank_addr][msg.sender].start_time = now;
        bank_client_Details[bank_addr][msg.sender].end_time =now + 2 minutes;//now + (year *1 years);
        bank_client_Details[bank_addr][msg.sender].year = year;
        bank_client_Details[bank_addr][msg.sender].check = true;
        
    }

    
    function fixed_amount_get(address bank_addr) public
    {
        require( bank_client_Details[bank_addr][msg.sender].check == true );
        
        uint256 temp_amount;
        uint256 temp_interest;
        uint256 temp_int_amt;
        uint256 temp_end_time;
        uint256 temp_year;
        
        temp_year = bank_client_Details[bank_addr][msg.sender].year;
        temp_amount = bank_client_Details[bank_addr][msg.sender].amount;
        temp_interest = bank_d1[bank_addr].fixed_deposit_interst;
        temp_end_time = bank_client_Details[bank_addr][msg.sender].end_time;
        
        if ( now >= temp_end_time )
        {
            temp_int_amt = temp_amount + ( (temp_amount * temp_year * (temp_interest/100)) / 100 );
            
            require(temp_int_amt <= bank_d1[bank_addr].bal);
            
            bank_d1[bank_addr].bal -= temp_int_amt;
            msg.sender.transfer( temp_int_amt );

            bank_d1[msg.sender].fixed_amount_user -= temp_amount;
            bank_d1[bank_addr].fixed_amount_bank -= temp_amount; 
            
            bank_client_Details[bank_addr][msg.sender].check = false;
        }
        
        else
        {
            temp_int_amt = temp_amount - (temp_amount / 100) ;
            
            require(temp_int_amt <= bank_d1[bank_addr].bal);
            
            bank_d1[bank_addr].bal -= temp_int_amt;
            msg.sender.transfer( temp_int_amt );

            bank_d1[msg.sender].fixed_amount_user -= temp_amount;
            bank_d1[bank_addr].fixed_amount_bank -= temp_amount;
            
            bank_client_Details[bank_addr][msg.sender].check = false;
        }
    }        
       
    
    
    function amount_settlement(address user_address) public
    {
        
        uint256 temp_amount;
        uint256 temp_interest;
        uint256 temp_int_amt;
        uint256 temp_end_time;
        uint256 temp_year;
        
        
        require( bank_client_Details[msg.sender][user_address].check == true );
        
        temp_end_time = bank_client_Details[msg.sender][user_address].end_time;
        require ( now >= temp_end_time );
        
        temp_year = bank_client_Details[msg.sender][user_address].year;
        temp_amount = bank_client_Details[msg.sender][user_address].amount;
        temp_interest = bank_d1[msg.sender].fixed_deposit_interst;
        
        temp_int_amt = temp_amount + ( (temp_amount * temp_year * (temp_interest / 100)) / 100 );
        
        require(temp_int_amt <= bank_d1[msg.sender].bal);
        
        bank_d1[msg.sender].bal -= temp_int_amt;
        user_address.transfer( temp_int_amt );

        bank_d1[msg.sender].fixed_amount_bank -= temp_amount;
        bank_d1[user_address].fixed_amount_user -= temp_amount;
        
        bank_client_Details[msg.sender][user_address].check = false;
    
    }
}