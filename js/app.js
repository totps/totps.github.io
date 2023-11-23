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
      activeClass: "active",
      qrCodeText: '',
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

      updateSecret: function () {
          if (this.secret_key.length != 16) {
              this.hasError = true
              this.SecretKeyTitle = "Secret Key (Length must be 16)"
          } else {
              this.hasError = false
              this.SecretKeyTitle = "Secret Key"
          }
      },

      generateUsername: function () {
          var randomUsername = faker.internet.userName()
          randomUsername = randomUsername.replace(/_/, "-")
          randomUsername = randomUsername.replace(/\./, "-")
          this.username = randomUsername;
      },

      generatePassword: function () {
          var pasArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_', '-', '$', '%', '&', '@', '+', '!'];
          var password = '';
          var pasArrLen = pasArr.length;
          for (var i = 0; i < 12; i++) {
              var x = Math.floor(Math.random() * pasArrLen);
              password += pasArr[x];
          }
          this.password = password;
      },

      generateAll: function () {
          this.generateUsername();
          this.generatePassword();
      },



      handleDrop(event) {
          event.preventDefault();

          const url = event.dataTransfer.getData('URL');
          console.info(url);

          const img = new Image();
          img.setAttribute('crossOrigin', 'anonymous');
          img.src = url;

          img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;

              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              const imageData = ctx.getImageData(0, 0, img.width, img.height);
              console.log(imageData)

              const code = jsQR(imageData.data, imageData.width, imageData.height);

              if (code) {
                  let match = code.data.match(/secret=([^&]*)/);
                  if (match) {
                      let secret = match[1]; // 提取第一个匹配项作为 secret 值
                      console.log(secret); // 输出：T5FEWWO5MJVICFPV
                      this.secret_key = secret;
                      this.qrCodeText = code.data;
                  }

                  
                  // code.data;

              } else {
                  this.qrCodeText = '无法解析二维码';
              }
          };

          img.onerror = () => {
              this.qrCodeText = '无效的图片 URL';
          };
      },


      // 文件转 base 64
      getBase64: function (url) {
          console.log(url);
          return new Promise(function (resolve, reject) {
              let img = new Image();
              img.setAttribute('crossOrigin', 'anonymous');
              img.src = url;
              img.onload = function () {
                  let canvas = document.createElement('canvas');
                  canvas.width = img.width;
                  canvas.height = img.height;

                  let ctx = canvas.getContext('2d');
                  ctx.drawImage(img, 0, 0);
                  let dataURL = canvas.toDataURL('image/png');
                  resolve(dataURL);
              };
              img.onerror = function (error) {
                  reject(error);
              };
          });
      },

      handleChange: function (url) {
          console.log(url);
          let _this = this;
          // 转 base 64
          this.getBase64(url).then((res) => {
              let img = new Image();
              img.src = res;
              img.onload = function () {
                  //  base64
                  var c = document.getElementById("qrcanvas");
                  var ctx = c.getContext("2d");

                  //  记一个坑，这里高度得除以 2 , 图片会拉伸
                  ctx.drawImage(img, 0, 0, img.width, img.height / 2);
                  var imageData = ctx.getImageData(0, 0, img.width, img.height);

                  // 再进行识别
                  const code = jsQR(imageData.data, imageData.width, imageData.height);

                  if (code) {
                      console.log("Found QR code:", code.data);
                  } else {
                      _this.$message("图片无对应二维码");
                  }
              };
          });
      },
  }
});
