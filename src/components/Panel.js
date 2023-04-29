import React from "react";

const Panel = ({ data }) => {
    const renderTree = (data, level = 0) => {
        return Object.entries(data).map(([key, value]) => {
            if (typeof value === "object" && value !== null) {
                return (
                    <div key={key} style={{ paddingLeft: level * 16 + "px" }}>
                        <span className="tree-arrow" onClick={(e) => e.currentTarget.parentNode.nextSibling.classList.toggle("hidden")}>
                            &gt;
                        </span>
                        {key}
                        <div>{renderTree(value, level + 1)}</div>
                    </div>
                );
            } else {
                return (
                    <div key={key} style={{ paddingLeft: level * 16 + "px" }}>
                        {key}: {value}
                    </div>
                );
            }
        });
    };

    return <div className="panel-container">{renderTree(data)}</div>;
};

export default Panel;