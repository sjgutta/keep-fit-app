import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Input = props => {
    return (
        <TextInput {...props} style={{ ...styles.input, ...props.style }} />
    );
};

const SearchInput = ({value, handleChange}) => {
    return (
        <div>
          <TextInput {...props} value={value} onChange={handleChange} />
        </div>
    );
};


const styles = StyleSheet.create({
    input: {
        height: 30,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginVertical: 10
    },
    searchInput: {
        height: 30,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginVertical: 10
    }
});

export default Input;
export { SearchInput} ;
