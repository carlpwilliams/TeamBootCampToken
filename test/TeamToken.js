var TeamBootcampToken = artifacts.require("./TeamBootcampToken.sol");

contract('TeamBootcampToken (TEAM)', function (accounts) {

  // required methods
  describe('required contract methods', () => {
    let requiredMethods = ['transferOwnership', 'transferFrom', 'totalSupply',
      'balanceOf'];

    requiredMethods.forEach(methodname => {
      it('should have a ' + methodname + ' method on the contract', () => {
        return TeamBootcampToken.deployed().then((instance) => {
          assert.notEqual(instance[methodname], undefined, methodname + ' method missing');
        });
      });
    });
  });

  it("should set the owner of the contract correctly", () => {
    return TeamBootcampToken.deployed().then((instance) => {
      return instance.owner.call();
    }).then((ownerAddress) => {
      assert.equal(accounts[0], ownerAddress);
    });
  });

  it("should put 2m TeamBootcampTokens in the owners account", function () {
    return TeamBootcampToken.deployed().then(function (instance) {
      return instance.balanceOf.call(accounts[0]);
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 2e+24, "2m tokens wasn't in the first account");
    });
  });

  it("should send coin correctly", function () {
    var meta;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return TeamBootcampToken.deployed().then(function (instance) {
      meta = instance;
      return meta.balanceOf.call(account_one);
    }).then(function (balance) {
      account_one_starting_balance = balance.toNumber();
      return meta.balanceOf.call(account_two);
    }).then(function (balance) {
      account_two_starting_balance = balance.toNumber();
      return meta.transfer(account_two, amount, { from: account_one });
    }).then(function () {
      return meta.balanceOf.call(account_one);
    }).then(function (balance) {
      account_one_ending_balance = balance.toNumber();
      return meta.balanceOf.call(account_two);
    }).then(function (balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });


  });

  it('should not transfer tokens to the 0 address (an invalid address)', () => {
    return TeamBootcampToken.deployed().then((instance) => {
      SUT = instance;
      SUT.transfer("0x0000000000000000000000000000000000000000", 10).then(

        (result) => {
          assert(false, 'should not get to transfer result');
        },
        (error) => {
          var revertFail = error.toString().indexOf('revert') != -1;
          assert.equal(revertFail, true, 'transfer was not reverted!');

        });
    });
  });

  it('should not transfer tokens to it\'s own address (don\'t send to self!', () => {
    return TeamBootcampToken.deployed().then((instance) => {
      SUT = instance;
      SUT.owner.call().then((owner) => {
        return SUT.transfer(SUT.address, 10);
      }).then((result) => {
        assert(false, 'should not get to transfer result');
      },
        (error) => {
          var revertFail = error.toString().indexOf('revert') != -1;
          assert.equal(revertFail, true, 'transfer was not reverted!');

        });
    });
  });

  it('should transfer ownership of the contract and transfer owners funds to the new address', function () {
    return TeamBootcampToken.deployed().then((instance) => {
      SUT = instance;
      return SUT.transferOwnership(accounts[3])
        .then(() => {
          return SUT.owner.call();
        }).then((result) => {
          assert.equal(accounts[3], result);
          return SUT.balanceOf.call(accounts[3]);
        }).then((balance) => {
          assert.equal(balance.toNumber(), '2e+24');// SUTConfig.initialSupply);
        });
    });
  });
});