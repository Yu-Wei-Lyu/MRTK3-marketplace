using System.Collections.Generic;
using UnityEngine;

namespace Assets.Scripts
{
    public class ShoppingCart
    {
        private readonly Dictionary<int, int> _shoppingDictionary;

        public ShoppingCart()
        {
            _shoppingDictionary = new Dictionary<int, int>();
        }

        public int Count => _shoppingDictionary.Count;

        // Get the reversed list of ID 
        public List<int> GetIDList()
        {
            List<int> reversedIDList = new List<int>(_shoppingDictionary.Keys);
            reversedIDList.Reverse();
            return reversedIDList;
        }

        // Get quantity of shopping item
        public int GetQuantityByID(int id)
        {
            return _shoppingDictionary[id];
        }

        // Add furnitures
        public void AddFurnitures(int id, int amount)
        {
            if (_shoppingDictionary.ContainsKey(id))
                _shoppingDictionary[id] += amount;
            else
                _shoppingDictionary[id] = amount;
        }

        // Decrease or delete furniture
        public void DecreaseFurnitureByID(int id, int quantity)
        {
            if (_shoppingDictionary.TryGetValue(id, out int currentQuantity))
            {
                currentQuantity -= quantity;
                if (currentQuantity <= 0)
                {
                    _shoppingDictionary.Remove(id);
                }
                else
                {
                    _shoppingDictionary[id] = currentQuantity;
                }
            }
        }
    }
}