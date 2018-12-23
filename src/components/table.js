import React from "react"

//import styles from "./table.module.css"

class Table extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            width: 1000
        };

    }
    componentDidMount(){
        window.addEventListener("resize", () => this.updateDimensions());
        this.updateDimensions()
    }

    componentWillUnmount(){
        window.removeEventListener("resize", () => this.updateDimensions());
    }
    updateDimensions(){
        let w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0],
        width = w.innerWidth || documentElement.clientWidth || body.clientWidth
        
        this.setState({width: width});
    }
    render(){
        const columnsToKeep = (this.props.columnsFilter) ?
         this.props.columnsFilter(this.state.width): 
         Array.from({length: this.props.header.length}, (x, i) => i);
         return (
            <table>
            <thead>
                <tr>
                    {this.props.header.filter((node, index) => columnsToKeep.includes(index))
                    .map(({title, width}, index) => (
                        <th key={title} style={{"minWidth": width}}>{title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {this.props.data.filter(n => n).map((node, index) => {
                    return (
                        <tr key = {node.id}>
                            {node.data.filter((node, index) => columnsToKeep.includes(index))
                            .map((node, index) => (
                                <td key={index}>{node}</td>
                            ))}
                        </tr>
                    )
                }
                )
                }
            </tbody>
            </table>
        )
    }
}

export default Table