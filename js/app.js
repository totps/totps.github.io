function getCurrentSeconds() {
  return Math.round(new Date().getTime() / 1000.0);
}

function stripSpaces(str) {
  return str.replace(/\s/g, '');
}

function truncateTo(str, digits) {
  if (str.length <= digits) {
    return str;
  }

  return str.slice(-digits);
}

function parseURLSearch(search) {
  const queryParams = search.substr(1).split('&').reduce(function (q, query) {
    const chunks = query.split('=');
    const key = chunks[0];
    let value = decodeURIComponent(chunks[1]);
    value = isNaN(Number(value)) ? value : Number(value);
    return (q[key] = value, q);
  }, {});

  return queryParams;
}

new Vue({
  el: '#app',
  data: {
    secret_key: '',
    digits: 6,
    period: 30,
    updatingIn: 30,
    token: null,
    clipboardButton: null,
    clipboardButtonUsername: null,
    clipboardButtonPassword: null,
    username: '',
    password: '',
    SecretKeyTitle: 'Your Secret Key',
    hasError: false,
    activeClass: "active"
  },

  mounted: function () {
    this.getKeyFromUrl();
    this.getQueryParameters()
    this.update();

    this.intervalHandle = setInterval(this.update, 1000);

    this.clipboardButton = new ClipboardJS('#clipboard-button');
    this.clipboardButtonUsername = new ClipboardJS('#clipboard-button-username');
    this.clipboardButtonPassword = new ClipboardJS('#clipboard-button-password');
  },

  destroyed: function () {
    clearInterval(this.intervalHandle);
  },

  computed: {
    totp: function () {
      return new OTPAuth.TOTP({
        algorithm: 'SHA1',
        digits: this.digits,
        period: this.period,
        secret: OTPAuth.Secret.fromB32(stripSpaces(this.secret_key)),
      });
    },
  },

  methods: {
    update: function () {
      this.updatingIn = this.period - (getCurrentSeconds() % this.period);
      this.token = truncateTo(this.totp.generate(), this.digits);
    },

    getKeyFromUrl: function () {
      const key = document.location.hash.replace(/[#\/]+/, '');

      if (key.length > 0) {
        this.secret_key = key;
      }
    },
    getQueryParameters: function () {
      const queryParams = parseURLSearch(window.location.search);

      if (queryParams.key) {
        this.secret_key = queryParams.key;
      }

      if (queryParams.digits) {
        this.digits = queryParams.digits;
      }

      if (queryParams.perfunction getCurrentSeconds() {
        return Math.round(new Date().getTime() / 1000.0);
      }
      
      function stripSpaces(str) {
        return str.replace(/\s/g, '');
      }
      
      function truncateTo(str, digits) {
        if (str.length <= digits) {
          return str;
        }
      
        return str.slice(-digits);
      }
      
      function parseURLSearch(search) {
        const queryParams = search.substr(1).split('&').reduce(function (q, query) {
          const chunks = query.split('=');
          const key = chunks[0];
          let value = decodeURIComponent(chunks[1]);
          value = isNaN(Number(value)) ? value : Number(value);
          return (q[key] = value, q);
        }, {});
      
        return queryParams;
      }
      
      new Vue({
        el: '#app',
        data: {
          secret_key: '',
          digits: 6,
          period: 30,
          updatingIn: 30,
          token: null,
          clipboardButton: null,
          clipboardButtonUsername: null,
          clipboardButtonPassword: null,
          username: '',
          password: '',
          SecretKeyTitle: 'Your Secret Key',
          hasError: false,
          activeClass: "active"
        },
      
        mounted: function () {
          this.getKeyFromUrl();
          this.getQueryParameters()
          this.update();
      
          this.intervalHandle = setInterval(this.update, 1000);
      
          this.clipboardButton = new ClipboardJS('#clipboard-button');
          this.clipboardButtonUsername = new ClipboardJS('#clipboard-button-username');
          this.clipboardButtonPassword = new ClipboardJS('#clipboard-button-password');
        },
      
        destroyed: function () {
          clearInterval(this.intervalHandle);
        },
      
        computed: {
          totp: function () {
            return new OTPAuth.TOTP({
              algorithm: 'SHA1',
              digits: this.digits,
              period: this.period,
              secret: OTPAuth.Secret.fromB32(stripSpaces(this.secret_key)),
            });
          },
        },
      
        methods: {
          update: function () {
            this.updatingIn = this.period - (getCurrentSeconds() % this.period);
            this.token = truncateTo(this.totp.generate(), this.digits);
          },
      
          getKeyFromUrl: function () {
            const key = document.location.hash.replace(/[#\/]+/, '');
      
            if (key.length > 0) {
              this.secret_key = key;
            }
          },
          getQueryParameters: function () {
            const queryParams = parseURLSearch(window.location.search);
      
            if (queryParams.key) {
              this.secret_key = queryParams.key;
            }
      
            if (queryParams.digits) {
              this.digits = queryParams.digits;
            }
      
            if (queryParams.period) {
              this.period = queryParams.period;
            }
          },
      
          updateSecret: function() {
              if(this.secret_key.length !=16){
                  this.hasError = true
                  this.SecretKeyTitle = "Your Secret Key (Length must be 16)"
              }else{
                  this.hasError = false
                  this.SecretKeyTitle = "Your Secret Key"
              }        
          },
      
          generateUsername: function(){
              var randomUsername = faker.internet.userName()
              randomUsername = randomUsername.replace(/_/,"-")
              randomUsername = randomUsername.replace(/\./,"-")
              this.username = randomUsername;
          },
      
          generatePassword: function(){
              var pasArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','_','-','$','%','&','@','+','!'];
              var password = '';
              var pasArrLen = pasArr.length;
              for (var i=0; i<12; i++){
                  var x = Math.floor(Math.random()*pasArrLen);
                  password += pasArr[x];
              }
              this.password = password;
          },
      
          generateAll: function(){
              this.generateUsername();
              this.generatePassword();
          }
        }
      });
      iod) {
        this.period = queryParams.period;
      }
    },

    updateSecret: function() {
        if(this.secret_key.length !=16){
            this.hasError = true
            this.SecretKeyTitle = "Your Secret Key (Length must be 16)"
        }else{
            this.hasError = false
            this.SecretKeyTitle = "Your Secret Key"
        }        
    },

    generateUsername: function(){
        var randomUsername = faker.internet.userName()
        randomUsername = randomUsername.replace(/_/,"-")
        randomUsername = randomUsername.replace(/\./,"-")
        this.username = randomUsername;
    },

    generatePassword: function(){
        var pasArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','_','-','$','%','&','@','+','!'];
        var password = '';
        var pasArrLen = pasArr.length;
        for (var i=0; i<12; i++){
            var x = Math.floor(Math.random()*pasArrLen);
            password += pasArr[x];
        }
        this.password = password;
    }
  }
});
