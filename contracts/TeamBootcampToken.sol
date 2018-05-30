pragma solidity ^0.4.21;

import "./ERC20Basic.sol";
import "./Ownable.sol";
import "./SafeMath.sol";

contract TeamBootcampToken is ERC20Basic, Ownable {
    using SafeMath for uint256;
    
    //constants
    string public constant name = "Team Bootcamp Token"; // solium-disable-line uppercase
    string public constant symbol = "TEAM"; // solium-disable-line uppercase
    uint8 public constant decimals = 18; // solium-disable-line uppercase
    uint256 public constant INITIAL_SUPPLY = 2000000;

    // vars
    mapping (address => mapping (address => uint256)) internal allowed;
    mapping(address => uint256) balances;
      
    uint256 totalSupply_;

    // events
    event Approval(address indexed owner, address indexed spender, uint256 value);
   
    /**
    * @dev Constructor that gives msg.sender all of existing tokens and sets the wei rate.
    */
    constructor() public {
        totalSupply_ = INITIAL_SUPPLY * (10 ** uint256(decimals));
        // give all tokens to the owner
        balances[msg.sender] = totalSupply_;
        emit Transfer(0x0, msg.sender, totalSupply_);
    }
       
    /**
    * @dev Transfer tokens from one address to another
    * @param _from address The address which you want to send tokens from
    * @param _to address The address which you want to transfer to
    * @param _value uint256 the amount of tokens to be transferred
    */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool)  {
        require(_value <= allowed[_from][msg.sender]);
        
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        return transferFromInternal(_from, _to, _value);
    }

    function transferFromInternal(address _from, address _to, uint256 _value) internal returns (bool) {
        require(_to != address(0));
        require(_value <= balances[_from]);
        require(_to != address(this));

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(_from, _to, _value);
        return true;
    }

    function transferOwnership(address newOwner) public onlyOwner{
        require(newOwner != address(0));
        address oldOwner = owner;
        uint256 balance = balances[oldOwner];
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        transferFromInternal(oldOwner,newOwner,balance);
    }

     /**
    * @dev total number of tokens in existence
    */
    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }

    /**
    * @dev transfer token for a specified address
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        require(_value <= balances[msg.sender]);
        require(_to != address(this));

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    /**
    * @dev Gets the balance of the specified address.
    * @param _owner The address to query the the balance of.
    * @return An uint256 representing the amount owned by the passed address.
    */
    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }
}