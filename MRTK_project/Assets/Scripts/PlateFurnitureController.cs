using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts
{
    public class PlateFurnitureController : Plate
    {
        private const string DETAILFORMAT = "價格：\tNT$ {0}\n尺寸：\t{1}cm\n材料：\t{2}\n供應商：\t{3}\n描述：\t{4}";
        private const string ADD_REQUEST_TITLE = "是否要將下述商品加入購物清單？";
        private const string ADD_CONFIRM_TITLE = "成功加入購物清單";
        private const string FURNITURE_NAME_MESSAGE = "商品：\n\t{0}";

        [SerializeField]
        private DataManager _dataManager;
        [SerializeField]
        private ShoppingList _shoppingList;
        [SerializeField]
        private PopupDialog _dialogController;
        [SerializeField]
        private TextMeshProUGUI _furnitureName;
        [SerializeField]
        private Image _furnitureImage;
        [SerializeField]
        private TextDisplayController _furnitureDetailManager;
        [SerializeField]
        private GameObject _expandDetailButton;
        [SerializeField]
        private RectTransform _rebuilderUtilityParentTarget;

        private AudioSource _audioSource;
        private bool _isLayoutChanged = false;
        private string _furnitureModelUri;
        private int _cacheFurnitureID = -1;

        // Update is called once per frame
        public override void Update()
        {
            base.Update();
            _expandDetailButton.SetActive(_furnitureDetailManager.IsTextOverflowing());
            if (_isLayoutChanged)
            {
                RebuildLayouts();
                _isLayoutChanged = false;
            }
        }

        // Contains the plate's elements which need to be initialized
        public override void Initialize()
        {
            _furnitureDetailManager.DefaultPerformance();
            UpdateFurnitureDisplay();
            _isLayoutChanged = true;
        }

        // Set product data to cache
        private void UpdateFurnitureDisplay()
        {
            var cacheFurnitureData = _dataManager.GetCacheFurnitureData();
            if (cacheFurnitureData != null)
            {
                _furnitureName.text = cacheFurnitureData.Name;
                _furnitureDetailManager.SetText(string.Format(DETAILFORMAT,
                    cacheFurnitureData.Price,
                    cacheFurnitureData.Size,
                    cacheFurnitureData.Material,
                    cacheFurnitureData.Manufacturer,
                    cacheFurnitureData.Description
                ));
                _furnitureImage.sprite = cacheFurnitureData.GetImageSprite();
                _furnitureModelUri = cacheFurnitureData.ModelURL;
            }
        }

        // Rebuild layouts request handler
        private void RebuildLayouts()
        {
            LayoutRebuilderUtility.RebuildLayoutsWithContentSizeFitter(_rebuilderUtilityParentTarget);
        }

        // Wait for sound played
        private IEnumerator WaitForSoundPlayed()
        {
            if (_audioSource.isPlaying)
            {
                yield return new WaitWhile(() => _audioSource.isPlaying);
                _audioSource = null;
            }
        }

        // SetAudioSourcePlaying
        public void SetAudioSourcePlaying(AudioSource source)
        {
            _audioSource = source;
        }

        // Trigger request of adding furniture to shopping list dialog
        public void AddingToListDialog()
        {
            if (_audioSource != null)
                StartCoroutine(WaitForSoundPlayed());
            var cacheDataObject = _dataManager.GetCacheFurnitureData();
            if (cacheDataObject != null)
            {
                _cacheFurnitureID = cacheDataObject.ID;
                _dialogController.AddToBeDeactived(transform.parent.gameObject);
                _dialogController.SetTexts(ADD_REQUEST_TITLE, string.Format(FURNITURE_NAME_MESSAGE, cacheDataObject.Name));
                _dialogController.WaitingResponseDialog(HandleAddRequest, true);
            }
        }

        // Handling the request for adding furniture to shopping list
        private void HandleAddRequest(PopupDialog.Response response, int amount)
        {
            if (response == PopupDialog.Response.Confirm)
            {
                _shoppingList.AddFurnitures(_cacheFurnitureID, amount);
                _cacheFurnitureID = -1;
                _dialogController.ConfirmDialog(ADD_CONFIRM_TITLE);
            }
        }

        // Trigger layout update, activated only when clicking the "Show More Details" button
        public void TriggerLayoutUpdate()
        {
            _isLayoutChanged = true;
        }

        // Call model to scene, activated only when clicking the "Display model" button
        public void CallModelToScene()
        {
            var glbLoader = new GlbLoader();
            glbLoader.SetPopupDialog(_dialogController);
            _ = glbLoader.LoadModelUri(_furnitureModelUri);
        }
    }
}