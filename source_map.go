package main

import (
	"log"
	"strconv"
	"strings"
)

type SourceMapping struct {
	Start  int
	Length int

	Line   int
	Column int
}

func ParseSourceMap(srcmap string, source string) []*SourceMapping {
	var sourceMap []*SourceMapping

	var prev SourceMapping
	for _, m := range strings.Split(srcmap, ";") {
		if len(m) == 0 {
			sourceMap = append(sourceMap, &prev)
			continue
		}

		parts := strings.Split(m, ":")

		next := SourceMapping{
			Start:  prev.Start,
			Length: prev.Length,
		}

		if len(parts) > 0 && parts[0] != "" {
			i, err := strconv.Atoi(parts[0])
			if err != nil {
				log.Fatal(err)
			}

			next.Start = i
		}

		if len(parts) > 1 && parts[1] != "" {
			i, err := strconv.Atoi(parts[1])
			if err != nil {
				log.Fatal(err)
			}

			next.Length = i
		}

		sourceMap = append(sourceMap, &next)
		prev = next
	}

	for _, mapping := range sourceMap {
		i := 0
		l := 1
		c := 1

		for i < mapping.Start {
			if source[i] == '\n' {
				l++
				c = 0
			}

			c++
			i++
		}

		mapping.Line = l
		mapping.Column = c
	}

	return sourceMap
}
