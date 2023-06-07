import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
const PdfComponent = ({ data, currentSelectedBaseGun }) => {
    return (
        <Document >
            <Page style={styles.document}>
                <View style={styles.container}>
                    <Text style={styles.textHeading} >La Capa Customs Gun Builder parts details</Text>
                    <Text style={styles.textHeadingTwo}>Base Gun: {currentSelectedBaseGun}</Text>
                    <View style={styles.tableRow}>
                        <Text style={[styles.headerCell, styles.header1, styles.textsNew]}>Part Number</Text>
                        <View style={styles.colSeparator} />
                        <Text style={[styles.headerCell, styles.header2, styles.textsNew]}>Product Category</Text>
                        <View style={styles.colSeparator} />
                        <Text style={[styles.headerCell, styles.header3, styles.textsNew]}>Color</Text>
                    </View>
                    {data.map((row, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.cell, styles.col1, styles.texts]}>{index + 1}</Text>
                            <View style={styles.colSeparator} />
                            {row.subcategory_name ?
                                <><View style={[styles.cell, styles.col2, styles.imageContainer]}>
                                    <Text style={[styles.texts]}>{row.category_name}, {row.subcategory_name} </Text>
                                    <Image src={row.image} style={[{ width: "100px", height: "70px" }, styles.image]} />
                                </View>
                                    <View style={styles.colSeparator} />
                                    <Text style={[styles.cell, styles.col3, styles.texts]}>{row.color}</Text>
                                </> : <>
                                    <View style={[styles.cell, styles.col2, styles.imageContainer]}>
                                        <Text style={styles.texts}>{row.category_name} </Text>
                                        <Image src={row.image} style={[{ width: "100px", height: "70px" }, styles.image]} />
                                    </View>
                                    <View style={styles.colSeparator} />
                                    <Text style={[styles.cell, styles.col3, styles.texts]}>{row.color}</Text>
                                </>}
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};
const styles = StyleSheet.create({
    document: { marginLeft: 24, marginRight: 24 },
    image: {
        paddingRight: 5,
        width: 100,
        height: 70
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
    },
    texts: {
        marginLeft: 5,
        fontSize: 12,
    },
    textsNew: {
        marginLeft: 5,
        fontSize: 14,
    },
    textHeadingTwo: {
        fontSize: 13,
        textAlign: "center",
        marginBottom: 20,
        marginTop: 5,
    },
    textHeading: {
        marginTop: 5,
        marginBottom: 20,
        textAlign: "center"
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 50,
        marginRight: 62,
        marginLeft: 16,
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    headerCell: {
        textAlign: 'start',
        fontWeight: 'bold',
    },
    cell: {
        textAlign: 'start',
    },
    header1: {
        width: "17%",
        paddingTop: 5,
        paddingBottom: 5
    },
    header2: {
        width: "68%",
        paddingTop: 5,
        paddingBottom: 5
    },
    header3: {
        width: "15%",
        paddingTop: 5,
        paddingBottom: 5
    },
    col1: {
        width: "16.86%",
        paddingTop: 5,
        paddingBottom: 5
    },
    col2: {
        width: "68.18%",
        paddingTop: 5,
        paddingBottom: 5
    },
    col3: {
        width: "14.86%",
        paddingTop: 5,
        paddingBottom: 5
    },
    colSeparator: {
        width: 1,
        backgroundColor: '#000',
        height: "100%"
    },
});


export default PdfComponent;
