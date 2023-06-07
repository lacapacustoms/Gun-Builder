import { useEffect, useState, useRef } from "react";
import "./styles/gun.css"
import { DisplaySvg } from "./DisplaySvg";
import Loader from "./loader/Loader";
import { Modal, Select, Switch } from "antd";
import NewSubCat from './NewSubCat';
import { useLayoutEffect } from "react";



const NewGunComponent = () => {
    const [isSun, setIsSun] = useState(false);
    const [changeSide, setChangeSide] = useState(false)
    const [loading, setLoading] = useState(true)
    const [apiRes, setApiRes] = useState([])
    const [baseGunData, setBaseGunData] = useState([])
    const [defaultSelectVal, setDefaultSelectVal] = useState("")
    const [getCurrentBaseGun, setCurrentBaseGun] = useState("")
    const [rearSights, setRearSights] = useState([])
    const [newCat, setNewCat] = useState([])
    const [gunCategoriesData, setGunCategoriesData] = useState([])
    const [newSelectedValue, setNewSelectedValue] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const elementRef = useRef(null);
    const [width, setWidth] = useState(0);
    const [isGunChanged, setIsGunChanged] = useState(false)
    const gunImageRef = useRef()
    useLayoutEffect(() => {
        const element = elementRef.current;

        const observer = new ResizeObserver(entries => {
            const newWidth = entries[0].contentRect.width;
            const newHeight = entries[0].contentRect.height;
            setWidth(newWidth);
        });
        if (element) {
            observer.observe(element);
        }
        return () => {
            observer.disconnect();
        };
    }, []);


    const handleSwitchChange = (checked) => {
        setIsSun(checked);
    };
    const handleChange = (value) => {
        setNewSelectedValue(value);
        setModalVisible(true);
    };

    const handleModalOk = () => {
        setDefaultSelectVal(newSelectedValue)
        setCurrentBaseGun(newSelectedValue)
        setModalVisible(false);
    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    const rightSvgString = `
  <svg id="rightGunString" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width <= 440 ? 600 : width <= 600 ? 800 : 1500}" height="550" viewBox="0 0 1500 550">
  ${baseGunData.map((el, index) => {
        if (el.right_side_image) {
            if (el.right_top_layer_image) {
                return `<image  x="0" y="0" width="1500" height="500" xlink:href="${el.right_side_image.replace(/"/g, '\\"')}" />
                <image  x="0" id="topLeftLayer" y="0" width="1500" height="500" xlink:href="${el.right_top_layer_image.replace(/"/g, '\\"')}" />
                `
            }
            return `<image  x="0" y="0" width="1500" height="500" xlink:href="${el.right_side_image.replace(/"/g, '\\"')}" />`
        }

    }).join('')}
    <use xlink:href="#topLeftLayer" />

  </svg>
  `;
    const svgString = `
  <svg id="leftGunString" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width <= 440 ? 600 : width <= 600 ? 800 : 1500}" height="550" viewBox="0 0 1500 550">
  ${baseGunData.map((el) => {
        if (el.left_side_image) {
            if (el.ambi_safety_name) {
                return `<image  id="ambi_saf" x="0" y="0" width="1500" height="500" xlink:href="${el.left_side_image.replace(/"/g, '\\"')}" style="position: absolute;z-index: 1" />`
            }
            if (el.left_top_layer_image) {
                return `<image  x="0" y="0" width="1500" height="500" xlink:href="${el.left_side_image.replace(/"/g, '\\"')}" />
                <image  x="0" id="topLeftLayer" y="0" width="1500" height="500" xlink:href="${el.left_top_layer_image.replace(/"/g, '\\"')}" />
                `
            }
            return `<image  x="0" y="0" width="1500" height="500" xlink:href="${el.left_side_image.replace(/"/g, '\\"')}" />`
        }

    }).join('')}
    <use xlink:href="#ambi_saf"/>
    <use xlink:href="#topLeftLayer"/>

  </svg>
  `;
    useEffect(() => {
        fetch('https://lacapacustoms.com/wp-json/wp/v2/pages/41061?acf_format=standard')
            .then(response => response.json())
            .then(data => {
                let newObjRes = data?.acf["base-gun"]?.sort((a, b) => {
                    return a.order.localeCompare(b.order, undefined, { numeric: true });
                });
                setApiRes(newObjRes)
            })
            .catch(error => {
                console.error(error)
            });
    }, [])
    useEffect(() => {
        const baseCat = apiRes.map((el) => el.name)
        const baseCatNew = apiRes.map((el) => ({ label: el.name, value: el.name }))
        setNewCat(baseCatNew)
        setDefaultSelectVal(baseCat[0])
        setCurrentBaseGun(baseCat[0])
    }, [apiRes])
    useEffect(() => {
        setLoading(true)

        if (getCurrentBaseGun) {
            let newData = []
            let findBaseObj = apiRes.find((el) => el.name === getCurrentBaseGun)
            let newObj = Object.keys(findBaseObj)
            let newObjFirstStep = newObj.map((el) => {
                if (Array.isArray(findBaseObj[el])) {
                    findBaseObj[el].map((el) => {
                        let newObj = {
                            ...el
                        }
                        newData.push(newObj)
                        return newObj
                    })
                }
            })
            let sortedArrayGun = newData?.sort((a, b) => {
                return a.initial_order.localeCompare(b.initial_order, undefined, { numeric: true });
            });
            setBaseGunData(sortedArrayGun)
            let newCasData = []
            let newCascaderCat = newData?.map((el, index) => {
                let newObj = {}
                const keyEndingWithName = Object.keys(el).find(key => key.endsWith('name'));
                newObj["value"] = keyEndingWithName
                newObj["label"] = el[keyEndingWithName]
                newObj["left_side_image"] = el.left_side_image
                newObj["right_side_image"] = el.right_side_image
                newObj["isDisabled"] = false
                newObj["order"] = el.order
                let newCatArray = []
                el.category.map((cat) => {
                    let catObj = {};
                    if (cat.sub_category_name) {
                        catObj["value"] = cat.category_name && cat.category_name.trim();
                        catObj["label"] = cat.category_name && cat.category_name.trim();
                        let newSubArray = cat.sub_category_name.map((subcat) => {
                            let newObj = {
                                value: subcat.sub_category_name && subcat.sub_category_name.trim(),
                                label: subcat.sub_category_name && subcat.sub_category_name.trim(),
                            };
                            let newClrs = subcat.colors
                                ?.sort((a, b) =>
                                    a.color_order.localeCompare(b.color_order, undefined, {
                                        numeric: true,
                                    })
                                )
                                .map((clr) => {
                                    return {
                                        value: clr.color_name && clr.color_name.trim(),
                                        label: clr.color_name && clr.color_name.trim(),
                                    };
                                })
                                .filter((clr) => clr.value && clr.label); // <-- Filter out empty values
                            newObj["children"] = newClrs;
                            return newObj;
                        });
                        catObj["children"] = newSubArray;
                    } else {
                        catObj["value"] = cat.category_name && cat.category_name.trim();
                        catObj["label"] = cat.category_name && cat.category_name.trim();
                        let newClrs = cat.colors
                            ?.sort((a, b) =>
                                a.color_order.localeCompare(b.color_order, undefined, {
                                    numeric: true,
                                })
                            )
                            .map((clr) => {
                                return {
                                    value: clr.color_name && clr.color_name.trim(),
                                    label: clr.color_name && clr.color_name.trim(),
                                };
                            })
                            .filter((clr) => clr.value && clr.label); // <-- Filter out empty values
                        catObj["children"] = newClrs;
                    }

                    if (catObj.value && catObj.label) {
                        newCatArray.push(catObj);
                    }
                });
                newObj["children"] = newCatArray
                newCasData.push(newObj)
            })
            const sortedCatData = newCasData.sort((a, b) =>
                a.order.localeCompare(b.order, undefined, {
                    numeric: true,
                })
            )
            setIsGunChanged(!isGunChanged)
            setGunCategoriesData(sortedCatData)
            const filteredSights = newData.filter(obj => obj.front_sight_name === "Front Sight" || obj.rear_sight_name === "Rear Sight");
            setRearSights(filteredSights)
            setTimeout(() => {
                setLoading(false);
            }, 7000)
        }
    }, [getCurrentBaseGun])

    return <div className="gun-parent-container" ref={elementRef} style={{ backgroundColor: isSun ? "white" : "#080808" }}>
        {loading && <Loader isSun={isSun} />}
        <div style={loading ? { pointerEvents: "none" } : {}} className="gun-container">
            <div className="gun-name">
                <div></div>
                <Select
                    size={"large"}
                    value={defaultSelectVal}
                    onChange={handleChange}
                    style={{
                        width: width <= 425 ? 200 : 300,
                    }}
                    options={newCat}
                />
                <Modal
                    title="Confirm Selection Change"
                    open={modalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                >
                    <p>All the selected categories will be reset.</p>
                </Modal>
                <div className="icons-change-bg">
                    <div className="switch-container">
                        <h3 className="icons-text" style={{ color: isSun ? "#000000" : "#ffffff" }}>{isSun ? 'Light Mode' : 'Dark Mode'}</h3>
                        <Switch
                            checked={isSun}
                            onChange={handleSwitchChange}
                            className={isSun ? "switch-on" : "switch-off"}
                        />
                    </div>
                </div>
            </div>

            <div className="imageBox" id="abcss" ref={gunImageRef}  >
                <DisplaySvg string={changeSide ? rightSvgString : svgString} />
            </div>
            <NewSubCat gunCategoriesData={gunCategoriesData} setGunCategoriesData={setGunCategoriesData} baseGunData={baseGunData} changeBaseGunData={setBaseGunData} changeGunSide={setChangeSide} currenGunSide={changeSide} isSun={isSun} rearSights={rearSights} respWidth={width} isGunChanged={isGunChanged} currentSelectedBaseGun={getCurrentBaseGun} />
        </div>
    </div>
};

export default NewGunComponent;

