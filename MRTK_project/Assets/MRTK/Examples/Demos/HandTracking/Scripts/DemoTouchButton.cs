﻿// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

using Microsoft.MixedReality.Toolkit.Input;
using UnityEngine;

namespace Microsoft.MixedReality.Toolkit.Examples.Demos
{
    [System.Obsolete("This component is no longer supported", true)]
    [AddComponentMenu("Scripts/MRTK/Obsolete/DemoTouchButton")]
    public class DemoTouchButton : MonoBehaviour, IMixedRealityPointerHandler
    {
        [SerializeField]
        private TextMesh debugMessage = null;

        private void Awake()
        {
            Debug.LogError(this.GetType().Name + " is deprecated");
        }

        void IMixedRealityPointerHandler.OnPointerClicked(MixedRealityPointerEventData eventData)
        {
        }

        void IMixedRealityPointerHandler.OnPointerDown(MixedRealityPointerEventData eventData)
        {
            if (debugMessage != null)
            {
                debugMessage.text = "OnPointerDown: " + Time.unscaledTime.ToString();
                Debug.Log(eventData.MixedRealityInputAction.Description + " down");
            }
        }

        void IMixedRealityPointerHandler.OnPointerDragged(MixedRealityPointerEventData eventData)
        {
        }

        void IMixedRealityPointerHandler.OnPointerUp(MixedRealityPointerEventData eventData)
        {
            if (debugMessage != null)
            {
                debugMessage.text = "OnPointerUp: " + Time.unscaledTime.ToString();
                Debug.Log(eventData.MixedRealityInputAction.Description + " up");
            }
        }
    }
}