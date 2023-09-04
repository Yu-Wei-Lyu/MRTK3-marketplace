const socket = new WebSocket('ws://118.150.125.153:8765');

// 點擊按鈕時發送訊息給伺服器
function sendQuery() {
  console.log("SendQuery");
  socket.send('{"type":"query"}');
};

// 點擊按鈕時將新資料加入伺服器
async function addData() {
  console.log("SendAdd");

  const imageInput = document.getElementById('picture');
  const selectedImage = imageInput.files[0];

  const fileInput = document.getElementById('model');
  const selectedFile = fileInput.files[0];

  const reader = new FileReader();
  reader.onload = async function(event) {
      const imageData = event.target.result;

      // 從輸入欄位獲取資料
      const name = document.getElementById('title').value;
      const price = document.getElementById('price').value;
      
      // 取得家具size
      const depth = document.getElementById('depth').value;
      const width = document.getElementById('width').value;
      const height = document.getElementById('height').value;
      const size = depth + 'x' + width + 'x' + height;

      // 取得分類標籤
      const selectedCategories = [];
      const checkboxes = document.querySelectorAll('input[name="category"]:checked');
      checkboxes.forEach(function(checkbox) {
          selectedCategories.push(checkbox.value);
      });
      // console.log('選中的分類：', selectedCategories);

      const description = document.getElementById('description').value;
      const material = document.getElementById('material').value;


      // 上傳圖片到 Imgur
      const formData = new FormData();
      formData.append('image', selectedImage);

      try {
          const imgurResponse = await fetch('https://api.imgur.com/3/image', {
              method: 'POST',
              headers: {
                  Authorization: 'Client-ID a4764610882ef96', // Replace with your Imgur Client ID
              },
              body: formData,
          });

          if (imgurResponse.ok) {
              const imgurData = await imgurResponse.json();
              const imgurImageUrl = imgurData.data.link;
              console.log('Imgur Image URL:', imgurImageUrl);

              // 文件上傳的開始
              const fileReader = new FileReader();

              fileReader.onload = async (event) => {
                  const fileData = event.target.result;

                  // 資料物件
                  const dataToSend = {
                      type: 'add',
                      Name: name,
                      Price: price,
                      Size: size,
                      Tags: selectedCategories,
                      Description: description,
                      Material: material,
                      // Manufacturer: manufacturer,
                      ImageUrl: imgurImageUrl, // Add Imgur Image URL
                      filename: selectedFile.name,
                      content: new Uint8Array(fileData),
                  };

                  const chunkSize = 8192; // 設定每個塊的大小（可以根據需要調整）

                  // 顯示進度條
                  const progressContainer = document.getElementById('progressContainer');
                  const progressBar = document.getElementById('progressBar');
                  const progressLabel = document.getElementById('progressLabel');
                  progressContainer.style.display = 'block';

                  // 將content分割傳送
                  for (let i = 0; i < dataToSend.content.length; i += chunkSize) {
                      const chunk = dataToSend.content.slice(i, i + chunkSize);
                      const dataChunk = { ...dataToSend, content: Array.from(chunk) };
                      socket.send(JSON.stringify(dataChunk));
                      
                      // 更新進度條的值和標籤
                      const progress = (i / dataToSend.content.length) * 100;
                      progressBar.value = progress;
                      progressLabel.textContent = `Uploading... ${progress.toFixed(2)}%`;

                      await new Promise(resolve => setTimeout(resolve, 10));
                    }

                console.log('檔案已上傳成功');
                // 修改顯示的文字
                progressLabel.textContent = `5秒後將刷新頁面並上傳至伺服器`;

                setTimeout(() => {
                console.log('Waiting for 5 seconds...');
                // console.log('Data sent, reloading page...');
                location.reload();
                }, 5000); // 5秒後執行

              };
              fileReader.readAsArrayBuffer(selectedFile);
          } else {
              console.error('Imgur Upload Error:', imgurResponse.statusText);
          }
      } catch (error) {
          console.error('Error during Imgur upload:', error);
      }
  };

  // 讀取文件為二進制數據
  reader.readAsArrayBuffer(selectedImage);
}

function myFunction() {
    var text = "確定要登出?";
    if (confirm(text) == true) {
      window.location.href = "/";
    }
}

function displayPictureName() {
    const PictureInput = document.getElementById("picture");
    const PictureNameSpan = document.getElementById("pictureName");
    PictureNameSpan.textContent = PictureInput.files[0]?.name || "";
}

function displayModelName() {
    const ModelInput = document.getElementById("model");
    const ModelNameSpan = document.getElementById("modelName");
    ModelNameSpan.textContent = ModelInput.files[0]?.name || "";
}

const unicode_hex_ranges = [
    Array.from(range(0x0020, 0x007E + 1)),
    Array.from(range(0x3000, 0x303F + 1)),
    Array.from(range(0x4E00, 0x9FFF + 1)),
    Array.from(range(0xFF00, 0xFFEF + 1))
];

function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx);
}
  
function handleAddClick() {
  const fields = [
    { id: 'title', name: '名稱', maxLength: 50 }, // 最大 50 個字
    { id: 'price', name: '售價', maxLength: 10 }, // 最大 10 個字
    { id: 'depth', name: '深度', maxLength: 9 }, // 最大 9 個字
    { id: 'width', name: '寬度', maxLength: 9 }, // 最大 9 個字
    { id: 'height', name: '高度', maxLength: 9 }, // 最大 9 個字
    { id: 'material', name: '材質', maxLength: 50 }, // 最大 50 個字
    { id: 'description', name: '描述', maxLength: 100 }, // 最大 100 個字
    // 添加其他欄位...
  ];

  let hasError = false;
  let invalidCharsText = '';

  fields.forEach(field => {
    const inputElement = document.getElementById(field.id);
    const inputValue = inputElement.value.trim(); // 去掉首尾空白
    const invalidChars = [];

    if (!inputValue) {
        hasError = true;
        const fieldErrorText = `${field.name}為必填欄位`;
        if (invalidCharsText === '') {
            invalidCharsText = fieldErrorText;
        } else {
            invalidCharsText += `<br>${fieldErrorText}`;
        }
    } else {
        inputValue.split('').forEach(char => {
            if (!unicode_hex_ranges.flat().includes(char.charCodeAt(0)) || char === '&') {
                invalidChars.push(char);
                hasError = true;
            }
        });

        if (inputValue.length > field.maxLength) {
            hasError = true;
            const fieldErrorText = `${field.name}欄位超過字數限制，最多允許${field.maxLength}個字`;
            if (invalidCharsText === '') {
                invalidCharsText = fieldErrorText;
            } else {
                invalidCharsText += `<br>${fieldErrorText}`;
            }
        } else if (invalidChars.length > 0) {
            const fieldErrorText = `${field.name}欄位中包含不允許的字符: ${invalidChars.join(', ')}`;
            if (invalidCharsText === '') {
                invalidCharsText = fieldErrorText;
            } else {
                invalidCharsText += `<br>${fieldErrorText}`;
            }
        }
    }
  });
  
  const pictureInput = document.getElementById('picture');
  const modelInput = document.getElementById('model');

  if (!pictureInput.files.length) {
      hasError = true;
      const fieldErrorText = '請選擇圖片';
      if (invalidCharsText === '') {
          invalidCharsText = fieldErrorText;
      } else {
          invalidCharsText += `<br>${fieldErrorText}`;
      }
  }

  if (!modelInput.files.length) {
      hasError = true;
      const fieldErrorText = '請選擇模型';
      if (invalidCharsText === '') {
          invalidCharsText = fieldErrorText;
      } else {
          invalidCharsText += `<br>${fieldErrorText}`;
      }
  }

  const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
  let categorySelected = false;

  categoryCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
          categorySelected = true;
      }
  });

  if (!categorySelected) {
      hasError = true;
      const fieldErrorText = '請選擇至少一個分類';
      if (invalidCharsText === '') {
          invalidCharsText = fieldErrorText;
      } else {
          invalidCharsText += `<br>${fieldErrorText}`;
      }
  }

  if (hasError) {
    const errorElement = document.getElementById('inputError');
    errorElement.innerHTML = invalidCharsText; // 使用 innerHTML 插入換行
    errorElement.style.display = 'inline-block'; // 顯示錯誤訊息
  } else {
    // 執行上架動作
    // TODO: 在這裡執行上架的相關操作
    addData();
    console.log('商品已上架');
    
    // 清除錯誤訊息
    const errorElement = document.getElementById('inputError');
    errorElement.style.display = 'none';
  }
}