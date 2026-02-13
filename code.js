
(function(Scratch){
    if(!Scratch.extensions.unsandboxed){alert("This extension must run unsandboxed!"); return}
    
    const lookup = {
        Label: "span", Video: "video", Image: "img", Input: "input", 
        Box: "div", Panel: "div", Button: "button", IFrame: "iframe", ProgressBar: "progress"
    }

    // --- ICONS (SVG) ---
    const extIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM3MDdlZmYiLz48cGF0aCBkPSJNIDEwIDE1IEwgMTAgMjUgTCAzMCAyNSBMIDMwIDE1IFoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';
    const textIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNTU1IiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik00IDdoVjVoMTZ2MmgtNHYxMmgtOHYtMTJINHoiLz48L3N2Zz4=';
    const imageIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNTU1IiBzdHJva2Utd2lkdGg9IjIiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIi8+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiLz48cGF0aCBkPSJNMjEgMTVsLTUtNWwtMTEgMTEiLz48L3N2Zz4=';
    const videoIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNTU1IiBzdHJva2Utd2lkdGg9IjIiPjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcng9IjIuMTgiIHJ5PSIyLjE4Ii8+PHBhdGggZD0iTTEwIDhsNiA0bC02IDQiLz48L3N2Zz4=';
    const inputIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNTU1IiBzdHJva2Utd2lkdGg9IjIiPjxyZWN0IHg9IjMiIHk9IjEwIiB3aWR0aD0iMTgiIGhlaWdodD0iNCIgcng9IjEiLz48cGF0aCBkPSJNNyAxMmgxMCIvPjwvc3ZnPg==';
    const buttonIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNTU1IiBzdHJva2Utd2lkdGg9IjIiPjxyZWN0IHg9IjIiIHk9IjYiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMiIgcng9IjIiLz48L3N2Zz4=';

    const vm = Scratch.vm
    

    const oldOverlay = document.querySelector('.LordCatInterfaces');
    if (oldOverlay) oldOverlay.remove();

    const oldStyle = document.querySelector('.LordCatInterfaces-Style');
    if (oldStyle) oldStyle.remove();


    const elementbox = document.createElement('div')
    elementbox.classList.add('LordCatInterfaces')
    
    // --- FIX 1: Explicit Dimensions & Pointer Events ---
    elementbox.style.width = `${vm.runtime.stageWidth}px`
    elementbox.style.height = `${vm.runtime.stageHeight}px`
    elementbox.style.pointerEvents = 'none' 
    
    vm.renderer.addOverlay(elementbox, "scale")
    let elements = {}
    let metadata = {}
    let inputhold = {}
    let lastValues = {}
    
    // CSS
    const css = document.createElement('style')
    css.textContent = `
        .LordCatInterfaces svg{ vertical-align: top; }
        .LordCatInterfaces[hidden]{ display: none }
        
        /* Toggle Switch Styling */
        .lordcat-toggle {
            appearance: none;
            -webkit-appearance: none;
            width: 40px !important;
            height: 22px !important;
            background: #ccc; /* Default OFF color */
            border-radius: 20px !important;
            position: relative;
            cursor: pointer;
            outline: none;
            transition: 0.3s;
            border: none !important;
        }
        .lordcat-toggle::after {
            content: '';
            position: absolute;
            top: 2px; left: 2px;
            width: 18px; height: 18px;
            background: white;
            border-radius: 50%;
            transition: 0.3s;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        
        .lordcat-toggle:checked {
            background: var(--active-color, #707eff) !important; 
        }
        
        .lordcat-toggle:checked::after {
            transform: translateX(18px);
        }

        /* Vertical Slider Styling */
        input[type=range][orient=vertical] {
            writing-mode: bt-lr; /* IE */
            -webkit-appearance: slider-vertical; /* WebKit */
            width: 8px;
            height: 100px;
        }
        
        /* --- FIX 2: Better Progress Bar Styling --- */
        progress {
            accent-color: var(--active-color, #707eff);
            height: 20px;
        }

        /* Improved Multi-Select Styling */
        .lordcat-multiselect-container {
            overflow-y: auto;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 2px;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .lordcat-multiselect-item {
            padding: 4px 8px;
            cursor: pointer;
            border-radius: 3px;
            font-family: sans-serif;
            font-size: 14px;
            transition: background 0.1s;
            user-select: none;
            border: 1px solid transparent;
        }
        .lordcat-multiselect-item:hover {
            background-color: #f0f0f0;
        }
        .lordcat-multiselect-item.selected {
            background-color: #e0e4ff;
            border-color: #707eff;
            color: #333;
            font-weight: 500;
        }
        .lordcat-multiselect-item.selected::before {
            content: "✔ ";
            color: #707eff;
        }
    `
    css.classList.add('LordCatInterfaces-Style')
    document.head.append(css)
    
    const datauri = (file) => {
        return new Promise((resolve, reject) => {
            if(!(file instanceof File)) resolve('')
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = () => reject(reader.error)
        })
    }
    
    const datauriFromCostume = (costume, target) => {
        let costumeIndex = target.getCostumeIndexByName(costume)
        if(costumeIndex === -1){
            switch(costume){
                case 'next costume': costumeIndex = target.currentCostume===target.sprite.costumes_.length-1?0:(target.currentCostume+1); break;
                case 'previous costume': costumeIndex = target.currentCostume===0?(target.sprite.costumes_.length-1):(target.currentCostume-1); break;
                case 'random costume': costumeIndex = Math.floor(Math.random() * target.sprite.costumes_.length); break;
            }
        }
        return target.sprite.costumes[costumeIndex].asset.encodeDataURI()
    }

    const attachListeners = (element, id) => {
        element.addEventListener("mouseover", () => metadata[id].hovered = true)
        element.addEventListener("mouseout", () => metadata[id].hovered = false)
        element.addEventListener("click", () => metadata[id].clicked = true)
        element.addEventListener("mouseenter", () => {
             metadata[id].justEntered = true;
             setTimeout(() => metadata[id].justEntered = false, 100);
        })
        if(element.tagName==="INPUT" || element.tagName==="TEXTAREA" || element.tagName==="SELECT"){
            element.addEventListener('input', () => metadata[id].inputdirty = true)
            element.addEventListener('change', () => metadata[id].inputdirty = true) 
            element.addEventListener('blur', () => {
                metadata[id].justBlurred = true;
                setTimeout(() => metadata[id].justBlurred = false, 100);
            })
        }
    }

    const replaceElement = (oldElement, newElement, id) => {
        newElement.setAttribute("style", oldElement.getAttribute("style"))
        if(oldElement.classList.contains('lordcat-toggle')) newElement.classList.add('lordcat-toggle');
        
        attachListeners(newElement, id)
        
        if((oldElement.tagName==="INPUT" || oldElement.tagName==="TEXTAREA" || oldElement.tagName==="SELECT") && (newElement.tagName === oldElement.tagName)){
            newElement.value = oldElement.value
            if(oldElement.checked) newElement.checked = true;
        }
        oldElement.replaceWith(newElement)
        return newElement
    }

    const fonts = []
    document.fonts.ready.then(() => {document.fonts.forEach(font => fonts.push(font.family));});

    class lordcatprojectinterfaces{
    getInfo(){return{
        id: "lordcatprojectinterfaces",
        name: "Project interfaces",
        color1: "#707eff",
        color2: "#6675fa",
        docsURI: "https://extensions.penguinmod.com/docs/ProjectInterfaces",
        menuIconURI: extIcon,
        blocks: [{
            opcode: "ClearAll",
            text: "Clear all elements",
            blockType: Scratch.BlockType.COMMAND
            },{
            opcode: "Create",
            text: "Create [type] element with ID [id]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {type: {type: Scratch.ArgumentType.STRING, menu: 'ElementType'}, id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}}
            },{
            opcode: "Delete",
            text: "Delete element with ID [id]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}}
            },{
            opcode: "SetParent",
            text: "Make [child] a child of [parent]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {child: {type: Scratch.ArgumentType.STRING, defaultValue: "Child"}, parent: {type: Scratch.ArgumentType.STRING, defaultValue: "Parent"}}
            },{
            opcode: "Visibility",
            text: "[menu] element with ID [id]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, menu: {type: Scratch.ArgumentType.STRING, menu: "Visibility"}}
            },{
            opcode: "ElementVisibility",
            text: "element with ID [id] is [status]",
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, status: {type: Scratch.ArgumentType.STRING, menu: "VisibilityStatus"}}
            },{
            opcode: "AllElements",
            text: "All elements",
            blockType: Scratch.BlockType.REPORTER
            },{blockType: Scratch.BlockType.LABEL, text: "Advanced Styling (Glass & Layout)"},
            {
            opcode: "SetGlassEffect",
            text: "Set Liquid Glass on [id]: [preset] blur [blur] intensity [opacity]%",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
                id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, 
                preset: {type: Scratch.ArgumentType.STRING, menu: 'GlassPresets'},
                blur: {type: Scratch.ArgumentType.NUMBER, defaultValue: 10},
                opacity: {type: Scratch.ArgumentType.NUMBER, defaultValue: 40}
            }
            },
            {
            opcode: "SetLayout",
            text: "Auto Layout [id]: [dir] gap [gap]px align [align]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
                id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'},
                dir: {type: Scratch.ArgumentType.STRING, menu: 'LayoutDir'},
                gap: {type: Scratch.ArgumentType.NUMBER, defaultValue: 5},
                align: {type: Scratch.ArgumentType.STRING, menu: 'LayoutAlign'}
            }
            },
            {blockType: Scratch.BlockType.LABEL, text: "Standard Styling"},{
            opcode: "Position",
            text: "Set position of ID [id] to x: [x] y: [y]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, x: {type: Scratch.ArgumentType.NUMBER, defaultValue: 0}, y: {type: Scratch.ArgumentType.NUMBER, defaultValue: 0}}
            },{
            opcode: "Direction",
            text: "Set direction of ID [id] to [dir]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, dir: {type: Scratch.ArgumentType.NUMBER, defaultValue: 90}}
            },{
            opcode: "Scale",
            text: "Set scale of ID [id] to width: [width]px height: [height]px",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, width: {type: Scratch.ArgumentType.NUMBER, defaultValue: 100}, height: {type: Scratch.ArgumentType.NUMBER, defaultValue: 100}}
            },{
            opcode: "AutoSize",
            text: "Auto size [id] to fit content",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}}
            },{
            opcode: "Layer",
            text: "Set layer of ID [id] to [layer]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, layer: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1}}
            },{
            opcode: "SetBorder",
            text: "Set border of [id] to [width]px [style] [color]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
                id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, 
                width: {type: Scratch.ArgumentType.NUMBER, defaultValue: 2},
                style: {type: Scratch.ArgumentType.STRING, menu: 'BorderStyles'},
                color: {type: Scratch.ArgumentType.COLOR}
            }
            },{
            opcode: "SetCornerRadius",
            text: "Set corner radius of [id] to [r]px",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, r: {type: Scratch.ArgumentType.NUMBER, defaultValue: 10}}
            },{
            opcode: "SetShadow",
            text: "Set shadow of [id] x: [x] y: [y] blur: [b] [color]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
                id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, 
                x: {type: Scratch.ArgumentType.NUMBER, defaultValue: 5},
                y: {type: Scratch.ArgumentType.NUMBER, defaultValue: 5},
                b: {type: Scratch.ArgumentType.NUMBER, defaultValue: 10},
                color: {type: Scratch.ArgumentType.COLOR, defaultValue: "#000000"}
            }
            },{
            opcode: "SetOpacity",
            text: "Set opacity of [id] to [val]%",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, val: {type: Scratch.ArgumentType.NUMBER, defaultValue: 100}}
            },{
            opcode: "SetTransition",
            text: "Set animation time of [id] to [time]s",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, time: {type: Scratch.ArgumentType.NUMBER, defaultValue: 0.3}}
            },{
            opcode: "Cursor",
            text: "Set hover cursor of ID [id] to [cursor]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, cursor: {type: Scratch.ArgumentType.STRING, menu: 'Cursors'}}
            },{
            opcode: "Color",
            text: "Set text color of ID [id] to [color]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, color: {type: Scratch.ArgumentType.COLOR}}
            },{
            opcode: "BackgroundColor",
            text: "Set background color of ID [id] to [color]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, color: {type: Scratch.ArgumentType.COLOR}}
            },{
            opcode: "CustomCSS",
            text: "Set custom CSS of [id] to [css]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, css: {type: Scratch.ArgumentType.STRING, defaultValue: 'background-color: red'}}
            },{
            opcode: "HtmlElement",
            text: "Create html element [htmltag] with ID [id]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, htmltag: {type: Scratch.ArgumentType.STRING, defaultValue: 'h1'}}
            },"---",{
            opcode: "WhenClicked",
            text: "When ID [id] is clicked",
            blockType: Scratch.BlockType.HAT,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}}
            },{
            opcode: "WhenHovered",
            text: "When cursor enters [id]",
            blockType: Scratch.BlockType.HAT,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}}
            },{
            opcode: "WhenFocusLost",
            text: "When input [id] loses focus",
            blockType: Scratch.BlockType.HAT,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}}
            },{
            opcode: "Attribute",
            text: "[attr] of ID [id]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {attr: {type: Scratch.ArgumentType.STRING, menu: "Attributes"}, id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}}
            },{
            opcode: "IsHovered",
            text: "[id] hovered?",
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}}
            },{
            blockType: Scratch.BlockType.LABEL,text: "Labels"},{
            opcode: "LabelText",
            text: "Set label text with ID [id] to [text]",
            arguments: {text: {type: Scratch.ArgumentType.STRING, defaultValue: "Hello world!"}, id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}},
            blockIconURI: textIcon
            },{
            opcode: "LabelAlign",
            text: "Set label alignment with ID [id] to [align]",
            arguments: {align: {type: Scratch.ArgumentType.STRING, menu: "Alignment"}, id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}},
            blockIconURI: textIcon
            },{
            opcode: "LabelFontSize",
            text: "Set label font size with ID [id] to [size]px",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, size: {type: Scratch.ArgumentType.NUMBER, defaultValue: 40}},
            blockIconURI: textIcon
            },{
            opcode: "LabelFont",
            text: "Set label font with ID [id] to [font]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, font: {type: Scratch.ArgumentType.STRING, menu: 'Fonts'}},
            blockIconURI: textIcon
            },{blockType: Scratch.BlockType.LABEL, text: "Images & Iframes"
            },{
            opcode: "ImageUrl",
            text: "Set image with ID [id] to url [url]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, url: {type: Scratch.ArgumentType.STRING, defaultValue: 'https://extensions.turbowarp.org/dango.png'}},
            blockIconURI: imageIcon
            },{
            opcode: "ImageCostume",
            text: "Set image with ID [id] to costume [costume]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, costume: {type: Scratch.ArgumentType.COSTUME}},
            blockIconURI: imageIcon
            },{
            opcode: "IFrameURL",
            text: "Set iframe [id] to url [url]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, url: {type: Scratch.ArgumentType.STRING, defaultValue: 'https://www.google.com/maps/embed'}},
            },{blockType: Scratch.BlockType.LABEL,text: "Videos"
            },{
            opcode: "VideoSource",
            text: "Set video with ID [id] to url [url]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, url: {type: Scratch.ArgumentType.STRING, defaultValue: 'https://extensions.turbowarp.org/dango.png'}},
            blockIconURI: videoIcon
            },{
            opcode: "VideoControl",
            text: "[control] video with ID [id]",
            arguments: {control: {type: Scratch.ArgumentType.STRING, menu: 'VideoControls'}, id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}},
            blockIconURI: videoIcon
            },{
            opcode: "VideoVolume",
            text: "Set volume of video [id] to [volume]%",
            arguments: {volume: {type: Scratch.ArgumentType.NUMBER, defaultValue: 100}, id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}},
            blockIconURI: videoIcon
            },{
            opcode: "VideoLoop",
            text: "Set loop of video [id] to [toggle]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, toggle: {type: Scratch.ArgumentType.STRING, menu: "EnableDisable"}},
            blockIconURI: videoIcon
            },{
            opcode: "VideoHtmlControls",
            text: "Set video controls of ID [id] to [toggle]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, toggle: {type: Scratch.ArgumentType.STRING, menu: "EnableDisable"}},
            blockIconURI: videoIcon
            },{blockType: Scratch.BlockType.LABEL, text: "Inputs, Pickers & Sliders"
            },{
            opcode: "InputType",
            text: "Set input type of ID [id] to [input]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, input: {type: Scratch.ArgumentType.STRING, menu: 'Inputs'}},
            blockIconURI: inputIcon
            },{
            opcode: "InputConfig",
            text: "Config input [id] max length: [len] readonly: [ro]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, len: {type: Scratch.ArgumentType.NUMBER, defaultValue: 20}, ro: {type: Scratch.ArgumentType.STRING, menu: "EnableDisable"}},
            blockIconURI: inputIcon
            },{
            opcode: "InputSetOptions",
            text: "Set dropdown options of ID [id] to [options]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, options: {type: Scratch.ArgumentType.STRING, defaultValue: "['A', 'B'] or {'Group': ['A']}"}},
            blockIconURI: inputIcon
            },{
            opcode: "InputSetDataList",
            text: "Config input [id] list options [options]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, options: {type: Scratch.ArgumentType.STRING, defaultValue: "Apple, Banana"}},
            blockIconURI: inputIcon
            },{
            opcode: "InputRangeConfig",
            text: "Config slider [id] min [min] max [max] step [step] [orient]",
            arguments: {
                id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, 
                min: {type: Scratch.ArgumentType.NUMBER, defaultValue: 0}, 
                max: {type: Scratch.ArgumentType.NUMBER, defaultValue: 100}, 
                step: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1},
                orient: {type: Scratch.ArgumentType.STRING, menu: 'Orientation', defaultValue: 'Horizontal'}
            },
            blockIconURI: inputIcon
            },{
            opcode: "SetProgress",
            text: "Set progress [id] value [val] max [max]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, val: {type: Scratch.ArgumentType.NUMBER, defaultValue: 50}, max: {type: Scratch.ArgumentType.NUMBER, defaultValue: 100}},
            },{
            opcode: "InputAccent",
            text: "Set input accent color of ID [id] to [color]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, color: {type: Scratch.ArgumentType.COLOR}},
            blockIconURI: inputIcon
            },{
            opcode: "InputPlaceholder",
            text: "Set placeholder of ID [id] to [placeholder]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, placeholder: {type: Scratch.ArgumentType.STRING, defaultValue: "Hello world!"}},
            blockIconURI: inputIcon
            },{
            opcode: "InputSetValue",
            text: "Set value of ID [id] to [value]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, value: {type: Scratch.ArgumentType.STRING, defaultValue: "Hello world!"}},
            blockIconURI: inputIcon
            },{
            opcode: "InputValue",
            text: "Value of input with ID [id]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}},
            blockIconURI: inputIcon
            },{
            opcode: "WhenInputChanged",
            text: "When input with ID [id] changed",
            blockType: Scratch.BlockType.HAT,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}},
            blockIconURI: inputIcon
            },{
            blockType: Scratch.BlockType.LABEL,
            text: "Buttons"
            },{
            opcode: "ButtonText",
            text: "Set text of button [id] to [text]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, text: {type: Scratch.ArgumentType.STRING, defaultValue: "Hello world!"}},
            blockIconURI: buttonIcon
            }
        ],
        menus: {ElementType: {acceptReporters: false,items: ["Label", "Image", "Video", "Input", "Box", "Panel", "Button", "IFrame", "ProgressBar"]},
            Inputs: {acceptReporters: false,items: ["Text", "Text Area", "Number", "Color", "Checkbox", "Toggle Switch", "File", "Email", "Range", "Image", "Dropdown", "Multiple Dropdown", "Password", "Username", "Date", "Time", "DateTime"]},
            Cursors: {acceptReporters: false,items: ["default", "pointer", "text", "wait", "move", "not-allowed", "crosshair","help", "progress", "grab", "grabbing"]},
            Fonts: {acceptReporters: true, items: fonts},
            Attributes: {acceptReporters: false, items: ['X', "Y", "Direction", "Width", "Height", "Cursor", "Source"]},
            VideoControls: {acceptReporters: false, items: ["Play", "Stop", "Pause"]},
            EnableDisable: {acceptReporters: false, items: ["Enabled", "Disabled"]},
            Alignment: {acceptReporters: false, items: ["Left", "Right", "Center"]},
            Visibility: {acceptReporters: false, items: ["Show", "Hide"]},
            VisibilityStatus: {acceptReporters: false, items: ["Shown", "Hidden"]},
            BorderStyles: {acceptReporters: false, items: ["solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset", "none"]},
            Orientation: {acceptReporters: false, items: ["Horizontal", "Vertical"]},
            GlassPresets: {acceptReporters: false, items: ["Liquid", "Frosted", "Crystal"]},
            LayoutDir: {acceptReporters: false, items: ["Row", "Column"]},
            LayoutAlign: {acceptReporters: false, items: ["center", "flex-start", "flex-end", "space-between", "space-around"]}
            },
    }}
    tutorial(){window.open("https://discord.com/channels/1033551490331197462/1390741725705797642/1390741725705797642")}
    FixPos(elementid){
        setTimeout(() => {
            if(!elements[elementid]){return}
            this.Position({id: elementid, x: metadata[elementid].x, y: metadata[elementid].y})
        }, 1)
    }
    FixTransform(elementid){
        setTimeout(() => {
            elements[elementid].style.transform = elements[elementid].tagName==='SVG'?`translate(-50%, -50%) rotate(${metadata[elementid]-90}deg)`:`rotate(${metadata[elementid]-90}deg)`
        }, 1)
    }
    ClearAll(){
        Object.entries(elements).forEach(([id, element]) => {
            if((element.tagName==="INPUT"||element.tagName==="TEXTAREA"||element.tagName==="SELECT")) inputhold[id] = element.type==="checkbox"?element.checked:element.value
        })
        elements = {}
        metadata = {}
        elementbox.innerHTML = ''
    }
    Create(args){
        if(elements[args.id]) return
        const element = document.createElement(lookup[args.type])
        
        if(args.type === 'Panel') {
            element.style.width = '300px';
            element.style.height = '200px';
            element.style.backgroundColor = 'rgba(240, 240, 240, 0.5)';
            element.style.borderRadius = '15px';
            element.style.overflow = 'hidden'; 
        }
        
        if(lookup[args.type] === 'button'){
            element.append(document.createElement('span'))
            element.append(document.createElement('img'))
        }
        const boundingRect = element.getBoundingClientRect()
        element.dataset.id = args.id
        element.style.position = 'absolute'
        element.style.pointerEvents = 'auto'
        element.style.userSelect = 'none'
        element.style.color = 'black'
        if(args.type == 'Image'){element.draggable = false}
        
        elements[args.id] = element
        elementbox.append(element)
        metadata[args.id] = {x: 0, y: 0, direction: 90, width: boundingRect.width, height: boundingRect.height, hovered: false, clicked: false, justEntered: false, justBlurred: false}
        this.FixPos(args.id)
        
        attachListeners(element, args.id)
    }
    SetParent(args) {
        const child = elements[args.child];
        const parent = elements[args.parent];
        if (!child || !parent) return;
        
        // Reset position to relative to parent 0,0 (center)
        child.style.position = 'absolute'; 
        parent.appendChild(child);
        this.FixPos(args.child);
    }
    // --- NEW: Liquid Glass Effect ---
    SetGlassEffect(args) {
        const el = elements[args.id];
        if(!el) return;
        
        const blur = args.blur;
        const opacity = args.opacity / 100;
        
        // Basic Backdrop blur
        el.style.backdropFilter = `blur(${blur}px) saturate(180%)`;
        el.style.webkitBackdropFilter = `blur(${blur}px) saturate(180%)`;
        
        if (args.preset === 'Liquid') {
            // iOS Liquid Style: High distortion shadows, soft white bg
            el.style.backgroundColor = `rgba(255, 255, 255, ${opacity * 0.6})`;
            el.style.boxShadow = `
                0 8px 32px 0 rgba(31, 38, 135, 0.2), 
                inset 0 0 0 1px rgba(255, 255, 255, 0.2),
                inset 0 0 ${blur/1.5}px rgba(255, 255, 255, 0.4)
            `;
            el.style.borderRadius = '20px';
            el.style.border = '1px solid rgba(255, 255, 255, 0.18)';
        } else if (args.preset === 'Crystal') {
            // Sharp, very transparent, strong borders
            el.style.backgroundColor = `rgba(255, 255, 255, ${opacity * 0.3})`;
            el.style.boxShadow = `0 4px 30px rgba(0, 0, 0, 0.1)`;
            el.style.border = '1px solid rgba(255, 255, 255, 0.8)';
            el.style.borderRadius = '10px';
        } else {
            // Frosted (Standard)
            el.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
            el.style.border = 'none';
        }
    }
    // --- NEW: Auto Layout ---
    SetLayout(args) {
        const el = elements[args.id];
        if(!el) return;
        el.style.display = 'flex';
        el.style.flexDirection = args.dir.toLowerCase(); // row or column
        el.style.gap = `${args.gap}px`;
        el.style.alignItems = args.align; // center, flex-start etc.
        el.style.justifyContent = args.align;
        
        // Reset absolute positioning for children if using flexbox
        Array.from(el.children).forEach(child => {
            child.style.position = 'relative';
            child.style.left = 'auto';
            child.style.top = 'auto';
            child.style.transform = 'none';
        });
    }
    Position(args){
        if(!elements[args.id]){return}
        const element = elements[args.id]
        
        // If element is part of a flex layout, don't use absolute positioning
        if (element.parentElement && element.parentElement.style.display === 'flex') return;

        if (element.parentElement === elementbox) {
            if(element.tagName==='svg'){
                const bbox = element.getBBox()
                element.style.left = `${(vm.runtime.stageWidth/2) + args.x - (bbox.width/2)}px`
                element.style.top = `${(vm.runtime.stageHeight/2) - args.y - (bbox.height/2)}px`
            }else{
                element.style.left = `${(vm.runtime.stageWidth/2) + args.x - (element.offsetWidth/2)}px`
                element.style.top = `${(vm.runtime.stageHeight/2) - args.y - (element.offsetHeight/2)}px`
            }
        } else {
            const parent = element.parentElement;
            element.style.left = `${(parent.offsetWidth/2) + args.x - (element.offsetWidth/2)}px`
            element.style.top = `${(parent.offsetHeight/2) - args.y - (element.offsetHeight/2)}px`
        }
        metadata[args.id].x = args.x
        metadata[args.id].y = args.y
    }
    Direction(args){
        if(!elements[args.id]){return}
        const element = elements[args.id]
        metadata[args.id].direction = args.dir
        element.style.transform = `rotate(${args.dir - 90}deg)`
    }
    Scale(args){
        if(!elements[args.id]){return}
        const element = elements[args.id]
        element.style.width = `${args.width}px`
        element.style.height = `${args.height}px`
        metadata[args.id].width = args.width + 'px'
        metadata[args.id].height = args.height + 'px'
        element.style.objectFit = 'fill'
        this.FixPos(args.id)
    }
    AutoSize(args) {
        if(!elements[args.id]) return;
        elements[args.id].style.width = 'auto';
        elements[args.id].style.height = 'auto';
        this.FixPos(args.id);
    }
    Layer(args){
        if(!elements[args.id]){return}
        const element = elements[args.id]
        element.style.zIndex = args.layer
    }
    SetBorder(args) {
        if(!elements[args.id]) return;
        elements[args.id].style.border = `${args.width}px ${args.style} ${args.color}`;
    }
    SetCornerRadius(args) {
        if(!elements[args.id]) return;
        elements[args.id].style.borderRadius = `${args.r}px`;
        elements[args.id].style.overflow = 'hidden';
    }
    SetShadow(args) {
        if(!elements[args.id]) return;
        elements[args.id].style.boxShadow = `${args.x}px ${args.y}px ${args.b}px ${args.color}`;
    }
    SetOpacity(args) {
        if(!elements[args.id]) return;
        elements[args.id].style.opacity = args.val / 100;
    }
    SetTransition(args) {
        if(!elements[args.id]) return;
        elements[args.id].style.transition = `all ${args.time}s ease`;
    }
    Cursor(args){
        if(!elements[args.id]){return}
        const element = elements[args.id]
        element.style.cursor = args.cursor
    }
    Color(args){
        if(!elements[args.id]){return}
        const el = elements[args.id]
        if(el.tagName == 'DIV'){el.style.backgroundColor = args.color; return}
        
        // --- FIX 3: Apply accent color for Progress Bars ---
        if(el.tagName == 'PROGRESS'){
             el.style.accentColor = args.color;
             el.style.setProperty('--active-color', args.color); // Update var for future use
             return;
        }
        
        el.style.color = args.color
    }
    BackgroundColor(args){
        if(!elements[args.id]){return}
        elements[args.id].style.backgroundColor = args.color
    }
    CustomCSS(args){
        if(!elements[args.id]){return}
        let style = document.getElementById(`LCGuiStyle_${args.id}`)
        let lines = args.css.split(";")
        if(!style){
            style = document.createElement('style')
            style.id = `LCGuiStyle_${args.id}`
            document.head.append(style)
        }
        style.textContent = `[data-id='${args.id}']{\n${lines.join(" !important;\n") + " !important"}\n}`
    }
    HtmlElement(args){
        if(elements[args.id]) return
        const element = document.createElement(args.htmltag.toLowerCase())
        const boundingRect = element.getBoundingClientRect()
        element.dataset.id = args.id
        element.style.position = 'absolute'
        element.style.pointerEvents = 'auto'
        element.style.userSelect = 'none'
        element.style.color = 'black'
        elements[args.id] = element
        elementbox.append(element)
        metadata[args.id] = {x: 0, y: 0, direction: 90, width: boundingRect.width, height: boundingRect.height, hovered: false, clicked: false, justEntered: false, justBlurred: false}
        this.FixPos(args.id)
        attachListeners(element, args.id)
    }
    Attribute(args){
        const element = elements[args.id]
        if(!element) return
        const meta = metadata[args.id]
        switch(args.attr){
            case 'Cursor': return element.style.cursor===""?"default":element.style.cursor;
            case 'Source': if(element.tagName != 'IMG' && element.tagName != 'VIDEO' && element.tagName != "svg") return; return element.tagName==='svg'?element.outerHTML:element.src;
            case 'Width': return element.getBBox ? element.getBBox().width : element.offsetWidth;
            case 'Height': return element.getBBox ? element.getBBox().height : element.offsetHeight;
            default: return meta[args.attr.toLowerCase()];
        }
    }
    IsHovered(args){
        if(!elements[args.id]){return ''}
        return metadata[args.id].hovered
    }
    Delete(args){
        const element = elements[args.id]
        if(!element){return}
        if((element.tagName==="INPUT"||element.tagName==="TEXTAREA"||element.tagName==="SELECT")) inputhold[args.id] = element.type==="checkbox"?element.checked:element.value
        if(document.getElementById(`LCGuiStyle_${args.id}`)) document.getElementById(`LCGuiStyle_${args.id}`).remove()
        
        // Remove associated datalist if exists
        const dl = document.getElementById(`datalist_${args.id}`);
        if(dl) dl.remove();

        element.remove()
        delete elements[args.id]
        delete metadata[args.id]
    }
    Visibility(args){
        if(!elements[args.id]){return}
        elements[args.id].hidden = (args.menu==="Hide")
    }
    ElementVisibility(args){
        if(!elements[args.id]) return
        return args.status==='Shown'?!elements[args.id].hidden:!!elements[args.id].hidden
    }
    AllElements(){return JSON.stringify(Object.keys(elements))}
    LabelText(args){
        if(!elements[args.id] || elements[args.id].tagName != "SPAN"){return}
        elements[args.id].textContent = args.text
        this.FixPos(args.id)
    }
    LabelAlign(args){
        if(!elements[args.id] || elements[args.id].tagName != "SPAN"){return}
        elements[args.id].style.textAlign = args.align.toLowerCase()
        this.FixPos(args.id)
    }
    LabelFontSize(args){
        if(!elements[args.id] || elements[args.id].tagName != "SPAN"){return}
        elements[args.id].style.fontSize = `${args.size}px`
        this.FixPos(args.id)
    }
    LabelFont(args){
        if(!elements[args.id] || elements[args.id].tagName != "SPAN"){return}
        elements[args.id].style.fontFamily = args.font 
        this.FixPos(args.id)
    }
    ImageUrl(args){
        if(!elements[args.id] || (elements[args.id].tagName != "IMG" && elements[args.id].tagName != "svg")){return}
        if(elements[args.id].tagName==='svg') elements[args.id] = replaceElement(elements[args.id], document.createElement('img'), args.id)
        elements[args.id].src = args.url
        this.FixPos(args.id)
    }
    ImageCostume(args, util){
        if(!elements[args.id] || (elements[args.id].tagName != "IMG" && elements[args.id].tagName != "svg")){return}
        if(util.target.getCostumes().find(costume => costume.name === args.costume).dataFormat === "svg"){
            const decoder = new TextDecoder('utf-8')
            const htmlparser = new DOMParser()
            elements[args.id] = replaceElement(elements[args.id],
                htmlparser.parseFromString(decoder.decode(util.target.getCostumes().find(costume => costume.name === args.costume).asset.data), 'image/svg+xml')
                .documentElement, args.id)
        }else{
            if(elements[args.id].tagName==='svg') elements[args.id] = replaceElement(elements[args.id], document.createElement('img'), args.id)
            elements[args.id].src = datauriFromCostume(args.costume, util.target)
        }
        this.FixPos(args.id)
        this.FixTransform(args.id)
    }
    IFrameURL(args) {
        if (!elements[args.id] || elements[args.id].tagName !== "IFRAME") return;
        elements[args.id].src = args.url;
        elements[args.id].style.border = "none";
    }
    InputType(args){
        if(!elements[args.id] || (elements[args.id].tagName != "INPUT" && elements[args.id].tagName != "TEXTAREA" && elements[args.id].tagName != "SELECT" && !elements[args.id].classList.contains("lordcat-multiselect-container"))){return}
        
        let newEl;
        
        // Handle Better Multiple Dropdown (Custom DIV)
        if (args.input === 'Multiple Dropdown') {
             if (!elements[args.id].classList.contains("lordcat-multiselect-container")) {
                 newEl = document.createElement('div');
                 newEl.classList.add('lordcat-multiselect-container');
                 newEl.style.width = '150px'; // Default width
                 newEl.style.height = '100px';
                 elements[args.id] = replaceElement(elements[args.id], newEl, args.id);
             }
        }
        // Handle Standard Dropdowns (Native Select)
        else if (args.input === 'Dropdown') {
             if (elements[args.id].tagName !== "SELECT") {
                 newEl = replaceElement(elements[args.id], document.createElement('select'), args.id)
                 elements[args.id] = newEl;
             }
             elements[args.id].multiple = false;
        } 
        // Handle Text Area
        else if(args.input === 'Text Area'){
            newEl = replaceElement(elements[args.id], document.createElement('textarea'), args.id)
            elements[args.id] = newEl;
            elements[args.id].style.resize = 'none'
        } 
        // Handle Standard Inputs
        else {
            if(elements[args.id].tagName !== "INPUT") {
                newEl = replaceElement(elements[args.id], document.createElement('input'), args.id)
                elements[args.id] = newEl;
            }
            
            // Special handling for Toggle Switch
            if (args.input === 'Toggle Switch') {
                elements[args.id].type = 'checkbox';
                elements[args.id].classList.add('lordcat-toggle');
            } else if (args.input === 'Username') {
                elements[args.id].type = 'text';
                elements[args.id].autocomplete = 'username';
                elements[args.id].classList.remove('lordcat-toggle');
            } else if (args.input === 'DateTime') {
                elements[args.id].type = 'datetime-local';
                elements[args.id].classList.remove('lordcat-toggle');
            } else {
                elements[args.id].type = args.input.toLowerCase();
                elements[args.id].classList.remove('lordcat-toggle');
            }
            
            if(args.input == 'File'){elements[args.id].value = null}
        }
        this.FixPos(args.id)
    }
    InputConfig(args) {
        if(!elements[args.id]) return;
        if(elements[args.id].tagName === "INPUT" || elements[args.id].tagName === "TEXTAREA") {
            elements[args.id].maxLength = args.len;
            elements[args.id].readOnly = (args.ro === "Enabled");
        }
    }
    InputRangeConfig(args) {
        if(!elements[args.id] || elements[args.id].type !== 'range') return;
        elements[args.id].min = args.min;
        elements[args.id].max = args.max;
        elements[args.id].step = args.step;
        
        if (args.orient === 'Vertical') {
            elements[args.id].setAttribute('orient', 'vertical');
            elements[args.id].style.appearance = 'slider-vertical'; 
        } else {
            elements[args.id].removeAttribute('orient');
            elements[args.id].style.appearance = 'auto';
        }
    }
    SetProgress(args) {
        if(!elements[args.id] || elements[args.id].tagName !== "PROGRESS") return;
        elements[args.id].value = args.val;
        elements[args.id].max = args.max;
    }
    InputSetDataList(args) {
        const el = elements[args.id];
        if(!el || el.tagName !== 'INPUT') return;
        
        let opts;
        try { opts = JSON.parse(args.options); } catch { opts = args.options.split(',').map(s => s.trim()); }
        if (!Array.isArray(opts)) opts = [args.options];

        // Create or reuse datalist
        let listId = `datalist_${args.id}`;
        let dl = document.getElementById(listId);
        if(!dl) {
            dl = document.createElement('datalist');
            dl.id = listId;
            document.body.append(dl);
        }
        dl.innerHTML = ''; // Clear old

        opts.forEach(opt => {
            const o = document.createElement('option');
            o.value = opt;
            dl.appendChild(o);
        });

        el.setAttribute('list', listId);
    }
    InputSetOptions(args){
        const el = elements[args.id];
        if(!el) return;
        
        // Parsing Options (Array or Object for Groups)
        let opts;
        try { 
            opts = JSON.parse(args.options); 
        } catch { 
            // Fallback for simple comma separated string
            opts = args.options.split(',').map(s => s.trim()); 
        }

        // --- Logic for Native Select (Dropdown) with OptGroups ---
        if(el.tagName === 'SELECT') {
            el.innerHTML = '';
            
            const addOption = (container, value, text) => {
                const o = document.createElement('option');
                o.value = value;
                o.textContent = text || value;
                container.appendChild(o);
            };

            if (Array.isArray(opts)) {
                // Flat Array
                opts.forEach(opt => addOption(el, opt));
            } else if (typeof opts === 'object') {
                // Object (OptGroups)
                for (const [groupName, groupItems] of Object.entries(opts)) {
                    const optGroup = document.createElement('optgroup');
                    optGroup.label = groupName;
                    if (Array.isArray(groupItems)) {
                         groupItems.forEach(item => addOption(optGroup, item));
                    }
                    el.appendChild(optGroup);
                }
            }
            return;
        }

        // --- Logic for Custom Multi-Select ---
        if(el.classList.contains('lordcat-multiselect-container')) {
            el.innerHTML = '';
            
            const addItem = (val, txt) => {
                const item = document.createElement('div');
                item.classList.add('lordcat-multiselect-item');
                item.dataset.value = val;
                item.textContent = txt || val;
                
                // Click to toggle selection
                item.onclick = (e) => {
                    e.stopPropagation(); // prevent triggering parent click
                    item.classList.toggle('selected');
                    metadata[args.id].inputdirty = true; // Trigger hat block
                };
                el.appendChild(item);
            };

            // Flatten structure for multiselect list
            if (Array.isArray(opts)) {
                opts.forEach(opt => addItem(opt));
            } else if (typeof opts === 'object') {
                 for (const [groupName, groupItems] of Object.entries(opts)) {
                    // Optional: Add a non-selectable header
                    const header = document.createElement('div');
                    header.textContent = groupName;
                    header.style.fontSize = '0.8em';
                    header.style.color = '#888';
                    header.style.padding = '2px 5px';
                    el.appendChild(header);
                    
                    if (Array.isArray(groupItems)) {
                         groupItems.forEach(item => addItem(item));
                    }
                }
            }
        }
    }
    InputAccent(args){
        if(!elements[args.id]) return
        // Default accent for normal inputs
        elements[args.id].style.accentColor = args.color
        // Variable for Custom Toggle Switch and Progress
        elements[args.id].style.setProperty('--active-color', args.color)
    }
    InputPlaceholder(args){
        if(!elements[args.id]) return
        elements[args.id].setAttribute('placeholder', args.placeholder)
    }
    InputSetValue(args){
        if(!elements[args.id]) return
        const el = elements[args.id];
        
        if (el.classList.contains('lordcat-multiselect-container')) {
             // Set values for custom multiselect (expects JSON array or comma string)
             let values = [];
             try { values = JSON.parse(args.value); } catch { values = [args.value.toString()]; }
             if(!Array.isArray(values)) values = [values.toString()];
             
             Array.from(el.children).forEach(child => {
                 if(child.classList.contains('lordcat-multiselect-item')) {
                     if(values.includes(child.dataset.value)) child.classList.add('selected');
                     else child.classList.remove('selected');
                 }
             });
        }
        else if(el.type === 'checkbox') el.checked = Scratch.Cast.toBoolean(args.value)
        else el.value = args.value
    }
    async InputValue(args){
        if(!elements[args.id] && inputhold[args.id]) return inputhold[args.id]
        const element = elements[args.id]
        if(!element) return ""
        
        // Custom Multiselect Value Getter
        if (element.classList.contains('lordcat-multiselect-container')) {
            const selected = [];
            Array.from(element.children).forEach(child => {
                if (child.classList.contains('selected')) {
                    selected.push(child.dataset.value);
                }
            });
            return JSON.stringify(selected);
        }

        if(element.type === 'checkbox') return element.checked
        if(element.type === 'file') return await datauri(element.files[0])
        if (element.tagName === 'SELECT' && element.multiple) {
            const selected = Array.from(element.selectedOptions).map(opt => opt.value);
            return JSON.stringify(selected);
        }
        return element.value
    }
    WhenInputChanged(args, util){
        if(!elements[args.id]) return false
        const element = elements[args.id]
        let value;
        
        if (element.classList.contains('lordcat-multiselect-container')) {
            const selected = [];
            Array.from(element.children).forEach(child => {
                if (child.classList.contains('selected')) selected.push(child.dataset.value);
            });
            value = JSON.stringify(selected);
        }
        else if (element.tagName === 'SELECT' && element.multiple) {
             value = JSON.stringify(Array.from(element.selectedOptions).map(opt => opt.value));
        } else {
             value = element.type==='checkbox'?element.checked:element.value
        }
        
        const blockId = util.thread.peekStack()
        if(!lastValues[blockId]) lastValues[blockId] = value.toString()
        if(lastValues[blockId] !== value.toString()){
            lastValues[blockId] = value.toString()
            return true
        }
        return false
    }
    WhenClicked(args){
        if(!metadata[args.id]) return false
        if(metadata[args.id].clicked){return new Promise((res, rej) => {
            setTimeout(() => {metadata[args.id].clicked = false; res(true)}, 1)
        })}
        return false
    }
    WhenHovered(args){
        if(!metadata[args.id]) return false
        if(metadata[args.id].justEntered) return true;
        return false
    }
    WhenFocusLost(args){
        if(!metadata[args.id]) return false
        if(metadata[args.id].justBlurred) return true;
        return false
    }
    VideoSource(args){
        const element = elements[args.id]
        if(!element || element.tagName != "VIDEO") return
        element.src = args.url
        this.FixPos(args.id)
    }
    VideoControl(args){
        const element = elements[args.id]
        if(!element || element.tagName != "VIDEO") return
        switch(args.control){
            case 'Play': element.play(); break;
            case 'Stop': element.pause(); element.currentTime = 0; break;
            case 'Pause': element.pause(); break;
        }
    }
    VideoVolume(args){
        const element = elements[args.id]
        if(!element || element.tagName != "VIDEO") return
        element.volume = (args.volume / 100)
    }
    VideoHtmlControls(args){
        const element = elements[args.id]
        if(!element || element.tagName != "VIDEO") return
        if(args.toggle === 'Enabled') element.setAttribute("controls", "true")
        else element.removeAttribute("controls")
    }
    VideoLoop(args){
        const element = elements[args.id]
        if(!element || element.tagName != "VIDEO") return
        element.loop = (args.toggle == "Enabled")
    }
    ButtonText(args){
        const element = elements[args.id]
        if(!element || element.tagName != "BUTTON") return
        document.querySelector(`.LordCatInterfaces button[data-id="${args.id}"] span`).textContent = args.text
        this.FixPos(args.id)
    }
    }
    Scratch.extensions.register(new lordcatprojectinterfaces())

})(Scratch)
