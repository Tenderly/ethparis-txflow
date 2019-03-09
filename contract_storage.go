package main

import (
	"encoding/json"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/pkg/errors"
	"io/ioutil"
	"path/filepath"
	"strings"
)

const (
	NodeTypeFunctionDefinition = "FunctionDefinition"
)

type ParametersNode struct {
	Parameters []*AstNode `json:"parameters"`
}

type TypeDescriptions struct {
	TypeString string `json:"typeString"`
}

type AstNode struct {
	NodeType   string `json:"nodeType"`
	Kind       string `json:"kind"`
	Name       string `json:"name"`
	Source     string `json:"src"`
	Visibility string `json:"visibility"`

	// Params
	TypeName         *AstNode         `json:"typeName"`
	TypeDescriptions TypeDescriptions `json:"typeDescriptions"`
	Parameters       ParametersNode   `json:"parameters"`

	Nodes []*AstNode `json:"nodes"`
}

func (node *AstNode) Receiver() string {
	sig := node.Name + "("

	var params []string
	for _, param := range node.Parameters.Parameters {
		params = append(params, param.TypeDescriptions.TypeString)
	}

	sig += strings.Join(params, ",")

	sig += ")"
	hash := crypto.Keccak256Hash([]byte(sig)).String()

	return hash[2:10]
}

type Network struct {
	Address string `json:"address"`
}

type TruffleContract struct {
	Name       string             `json:"contractName"`
	Ast        *AstNode           `json:"ast"`
	SourceMap  string             `json:"deployedSourceMap"`
	SourceCode string             `json:"source"`
	Networks   map[string]Network `json:"networks"`

	Address string `json:"contractAddress"`
}

func ReadTruffleContract(path string) (*TruffleContract, error) {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var contract TruffleContract
	err = json.Unmarshal(data, &contract)
	if err != nil {
		return nil, err
	}

	return &contract, nil
}

func Contracts() (map[string]*TruffleContract, error) {
	contracts := make(map[string]*TruffleContract)

	dir := "build/contracts"
	files, err := ioutil.ReadDir(dir)
	if err != nil {
		return nil, errors.Wrap(err, "cannot read dir")
	}

	for _, f := range files {
		if f.IsDir() {
			continue
		}

		contract, err := ReadTruffleContract(filepath.Join(dir, f.Name()))
		if err != nil {
			return nil, errors.Wrap(err, "cannot read contract")
		}

		for _, network := range contract.Networks {
			contracts[strings.ToLower(network.Address)] = contract
		}
	}

	return contracts, nil
}
