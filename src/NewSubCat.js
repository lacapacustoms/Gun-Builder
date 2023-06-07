import React, { useEffect, useRef, useState } from 'react';
import { Cascader } from 'antd';
import "./styles/select-boxes.css"
import "./styles/categoies.css"
import PdfComponent from './PdfComponent';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import { saveSvgAsPng } from 'save-svg-as-png';
const getSelectedCategoryImages = (baseData, selectedData) => {
    let newSelectedVals = selectedData.filter((item) => item !== undefined)

    let newBaseData = baseData?.map((el) => {
        let newData = {}
        el.category.map((cat) => {
            if (cat.sub_category_name) {
                cat.sub_category_name.map((subCat) => {
                    newSelectedVals.map((sel) => {
                        if (subCat.sub_category_name.trim() === sel.value[1]) {
                            subCat.colors.map((clrs) => {
                                if (clrs.color_name === sel.value[2]) {
                                    newData["category_name"] = cat.category_name.trim()
                                    newData["sub_category_name"] = subCat.sub_category_name.trim()
                                    newData["color"] = clrs.color_name.trim()
                                    newData["image"] = clrs.left_side_image
                                }
                            })
                        }
                    })
                })
            } else {
                newSelectedVals.map((sel) => {
                    if (cat.category_name.trim() === sel.value[0]) {
                        cat.colors.map((clrs) => {
                            if (clrs.color_name === sel.value[1]) {
                                newData["category_name"] = cat.category_name.trim()
                                newData["color"] = clrs.color_name.trim()
                                newData["image"] = clrs.left_side_image
                            }
                        })
                    }
                })

            }

        })

        return newData
    })
    const filteredArray = newBaseData.filter((element, index) => {
        if (typeof element === "object" && Object.keys(element).length === 0) {
            return false; // Exclude empty objects
        }
        return element !== "" && newBaseData.indexOf(element) === index; // Exclude empty strings and duplicates
    });
    return filteredArray
}
const sortedArray = (arrayToSort) => {
    let newArray = arrayToSort.sort((a, b) => {
        return a.initial_order.localeCompare(b.initial_order, undefined, { numeric: true });
    });
    return newArray
}

const downloadSVG = (svgId) => {
    let svgElement = document.getElementById(`${svgId}`);
    saveSvgAsPng(svgElement, 'lacapa_customs_gun.png', { backgroundColor: 'white' })
        .then((uri) => {
            saveAs(uri, 'lacapa_customs_gun.png');
        })
        .catch((error) => {
            console.error('Error converting SVG to PNG:', error);
        });
};

function NewSubCat({ gunCategoriesData, changeBaseGunData, baseGunData, changeGunSide, isSun, rearSights, respWidth, setGunCategoriesData, isGunChanged, currentSelectedBaseGun, currenGunSide }) {
    const [selectedValues, setSelectedValues] = useState([]);
    const [openCascader, setOpenCascader] = useState(null);
    const [isCobra, setIsCobra] = useState(false);
    const cascaderRef = useRef();

    const handleChange = (value, selectedOptions, index = null, resetData = null, isCobraChild = false) => {
        if (resetData) {
            const updatedSelectedValues = [...selectedValues];
            updatedSelectedValues[index] = {};
            setSelectedValues(updatedSelectedValues);
            let newBaseData = baseGunData?.map((el) => {
                const keyEndingWithName = Object.keys(el).find(key => key.endsWith('name'));
                if (keyEndingWithName === resetData.value) {
                    el["left_side_image"] = resetData.left_side_image
                    el["right_side_image"] = resetData.right_side_image
                }
                return el
            })

            if (isCobra && isCobraChild) {
                setIsCobra(false)
                let newData = [...newBaseData, ...rearSights]
                let newBaseCat = gunCategoriesData.map((el) => {
                    el["isDisabled"] = false
                    return el
                })
                let newGunArray = sortedArray(newData)
                setGunCategoriesData(newBaseCat)
                changeBaseGunData(newGunArray)
            } else {
                let newGunArray = sortedArray(newBaseData)
                changeBaseGunData(newGunArray)
            }
        } else {

            const newSelectedValues = [...selectedValues];
            newSelectedValues[index] = value ? { label: selectedOptions[selectedOptions.length - 1].label, value } : null;
            setSelectedValues(newSelectedValues);
            setOpenCascader(value[value.length - 1]);
            let newBaseData = baseGunData?.map((el) => {
                let currentLeftImage = el.left_side_image
                let currentRightImage = el.right_side_image
                el.category.map((cat) => {
                    if (cat.sub_category_name) {
                        cat.sub_category_name.map((subCat) => {
                            if (subCat.sub_category_name.trim() === value[1]) {
                                subCat.colors.map((clrs) => {
                                    if (clrs.color_name.trim() === value[2]) {
                                        currentLeftImage = clrs.left_side_image
                                        currentRightImage = clrs.right_side_image
                                    }
                                })
                            }
                        })
                    } else {
                        if (cat.category_name.trim() === value[0]) {
                            cat.colors.map((clrs) => {
                                if (clrs.color_name.trim() === value[1]) {
                                    currentLeftImage = clrs.left_side_image
                                    currentRightImage = clrs.right_side_image
                                }
                            })
                        }
                    }

                })

                el["left_side_image"] = currentLeftImage
                el["right_side_image"] = currentRightImage
                return el
            })
            if (value[0] === "LCC JUNGLE CAT 5.1" || value[0] === "LCC VOID Slide 5.1") {
                setIsCobra(false)

                let newData = [...newBaseData, ...rearSights]
                let newBaseCat = gunCategoriesData.map((el) => {
                    el["isDisabled"] = false
                    return el
                })
                let newGunArray = sortedArray(newData)
                setGunCategoriesData(newBaseCat)
                changeBaseGunData(newGunArray)
            } else if (value[0] === "LCC COBRA 5.1" || value[0] === "LCC COBRA 5.1" || isCobra) {
                setIsCobra(true)
                let newFilteredData = newBaseData.filter((obj => obj.front_sight_name !== "Front Sight" && obj.rear_sight_name !== "Rear Sight"))
                let newBaseCat = gunCategoriesData.map((el) => {
                    if (el.value === "rear_sight_name" || el.value === "front_sight_name") {
                        el["isDisabled"] = true
                    }
                    return el
                })
                let newGunArray = sortedArray(newFilteredData)
                setGunCategoriesData(newBaseCat)
                changeBaseGunData(newGunArray)
            } else {
                let newGunArray = sortedArray(newBaseData)
                changeBaseGunData(newGunArray)
            }
            cascaderRef.current.blur();
        }

    };
    const downloadPDF = async () => {

        let newSelectedVals = selectedValues.filter((item) => item !== undefined)
        let newData = getSelectedCategoryImages(baseGunData, newSelectedVals)
        const blob = await pdf(<PdfComponent data={newData} currentSelectedBaseGun={currentSelectedBaseGun} />).toBlob();
        saveAs(blob, 'La Capa Customs build details.pdf');
    };
    const downloadImage = async () => {
        if (currenGunSide === false) {
            downloadSVG("leftGunString")
        } else {
            downloadSVG("rightGunString")
        }
    };
    useEffect(() => {
        setSelectedValues([])
        let combinedGun = [...baseGunData, ...rearSights]
        let newBaseGun = sortedArray(combinedGun)
        let newBaseCat = gunCategoriesData.map((el) => {
            el["isDisabled"] = false
            return el
        })
        changeBaseGunData(newBaseGun)
        setGunCategoriesData(newBaseCat)
    }, [isGunChanged])
    return (
        <>
            <div className='buttons-container'>
                <button className="buttons" onClick={() => {
                    changeGunSide((prevState) => {
                        if (prevState) {
                            return false
                        } else {
                            return true
                        }
                    })
                }}>
                    Switch Side
                </button>
                <button className={`buttons ${selectedValues.length >= 1 ? "" : "disabled"}`} disabled={selectedValues.length >= 1 ? false : true} onClick={downloadPDF}>Download PDF</button>
                <button className={`buttons ${selectedValues.length >= 1 ? "" : "disabled"}`} disabled={selectedValues.length >= 1 ? false : true} onClick={downloadImage}>Download Image</button>
            </div>
            <div className='drop-down-container'>

                <div className='gun-drop-downs cascader-parent'>
                    {gunCategoriesData.map((category, index) => {
                        const isCurrentCascader = openCascader === category.value;
                        const newSelectedValue = selectedValues[index] ? selectedValues[index].value : null;
                        let isCobraChild
                        if (newSelectedValue) {
                            isCobraChild = category.value === "rear_sight_name" && isCobra ? true : category.value === "front_sight_name" && isCobra ? true : newSelectedValue[0] === "LCC COBRA 5.1" ? true : false

                        } else {
                            isCobraChild = category.value === "rear_sight_name" && isCobra ? true : category.value === "front_sight_name" && isCobra ? true : false
                        }
                        return (
                            <div key={category.value} >
                                <div className='drop-text'>
                                    <h4 className='drop-heading' style={{ color: isSun ? "black" : "white" }}>
                                        {category.label}
                                    </h4>
                                    {category.value === "rear_sight_name" && isCobra ? null : category.value === "front_sight_name" && isCobra ? null : (
                                        <div className='drop-text-btn' onClick={() => handleChange(null, null, index, category, isCobraChild)}>Reset</div>
                                    )}
                                </div>
                                <Cascader
                                    ref={cascaderRef}
                                    options={category.children}
                                    disabled={category.isDisabled}
                                    value={newSelectedValue}
                                    open={isCurrentCascader}
                                    onDropdownVisibleChange={(open) => setOpenCascader(open ? category.value : null)}
                                    changeOnSelect={false}
                                    expandTrigger='hover'
                                    onChange={(value, selectedOptions) => {
                                        if (isCurrentCascader && !value?.length) {
                                            setOpenCascader(openCascader.filter((item) => item !== category.value));
                                        } else {
                                            if (Array.isArray(openCascader) && openCascader.includes(category.value)) {
                                                setOpenCascader(openCascader.filter((item) => item !== category.value));
                                            } else {
                                                setOpenCascader([...openCascader, category.value]);
                                            }
                                        }
                                        handleChange(value, selectedOptions, index);
                                    }}
                                    placeholder={`Select a ${category.label}`
                                    }
                                    className='my-cascader'
                                    style={{
                                        width: respWidth <= 380 ? 120 : respWidth <= 768 ? 150 : 200,
                                    }}
                                    getPopupContainer={() => document.body}
                                    popupClassName="custom-cascader-dropdown"
                                    dropdownRender={(menu) => (
                                        <div
                                            style={{
                                                backgroundColor: "#fff",
                                            }}
                                        >
                                            {menu}
                                        </div>
                                    )
                                    }
                                    displayRender={(labels, selectedOptions) => {
                                        const selectedOption = selectedOptions[selectedOptions.length - 1];
                                        const isSelectedChild = selectedOption && selectedOption.value === category.value;
                                        const backgroundColor = isSelectedChild ? "black" : "transparent";
                                        const selectedOptionOrder = selectedOption?.value;
                                        const displayText = selectedOptionOrder
                                            ? `${selectedOptionOrder}`
                                            : labels[labels.length - 1] || `Select a ${category.label}`;
                                        return (
                                            <div style={{ backgroundColor }}>
                                                {displayText}
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

            </div ></>

    );
}

export default React.memo(NewSubCat);











