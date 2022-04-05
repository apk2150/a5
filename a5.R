
library(dplyr)
library(tidyr)
library(purrr)
library(readr)
library(ggplot2)
library(langcog)
library(wordbankr)
library(boot)
library(lazyeval)
library(tidyverse)
#theme_set(theme_mikabr())
# 
# data_mode <- "local"
# 
# admins <- get_administration_data(mode = data_mode) %>%
#   select(data_id, age, language, form)
# 
# items <- get_item_data(mode = data_mode) %>%
#   mutate(num_item_id = as.numeric(substr(item_id, 6, nchar(item_id))),
#          definition = tolower(definition))
# 
# words <- items %>%
#   filter(type == "word", !is.na(uni_lemma), form == "WG")
# 
# invalid_uni_lemmas <- words %>%
#   group_by(uni_lemma) %>%
#   filter(n() > 1,
#          length(unique(lexical_class)) > 1) %>%
#   arrange(language, uni_lemma)
# 
# get_inst_data <- function(inst_items) {
#   inst_language <- unique(inst_items$language)
#   inst_form <- unique(inst_items$form)
#   inst_admins <- filter(admins, language == inst_language, form == inst_form)
#   get_instrument_data(instrument_language = inst_language,
#                       instrument_form = inst_form,
#                       items = inst_items$item_id,
#                       administrations = inst_admins,
#                       iteminfo = inst_items,
#                       mode = data_mode) %>%
#     filter(!is.na(age)) %>%
#     mutate(produces = !is.na(value) & value == "produces",
#            understands = !is.na(value) & (value == "understands" | value == "produces")) %>%
#     select(-value) %>%
#     gather(measure, value, produces, understands) %>%
#     mutate(language = inst_language,
#            form = inst_form)
# }
# 
# items_by_inst <- split(words, paste(words$language, words$form, sep = "_"))
# raw_data <- map(items_by_inst, get_inst_data)
# 
# fit_inst_measure_uni <- function(inst_measure_uni_data) {
#   ages <- min(inst_measure_uni_data$age):max(inst_measure_uni_data$age)
#   model <- glm(cbind(num_true, num_false) ~ age, family = "binomial",
#                data = inst_measure_uni_data)
#   fit <- predict(model, newdata = data.frame(age = ages), se.fit = TRUE)
#   aoa <- -model$coefficients[["(Intercept)"]] / model$coefficients[["age"]]
#   constants <- inst_measure_uni_data %>%
#     select(language, form, measure, lexical_category, lexical_class, uni_lemma,
#            words) %>%
#     distinct()
#   props <- inst_measure_uni_data %>%
#     ungroup() %>%
#     select(age, prop)
#   data.frame(age = ages, fit_prop = inv.logit(fit$fit), fit_se = fit$se.fit,
#              aoa = aoa, language = constants$language, form = constants$form,
#              measure = constants$measure,
#              lexical_category = constants$lexical_category,
#              lexical_class = constants$lexical_class,
#              uni_lemma = constants$uni_lemma, words = constants$words) %>%
#     left_join(props)
# }
# 
# fit_inst_measure <- function(inst_measure_data) {
#   inst_measure_by_uni <- inst_measure_data %>%
#     group_by(language, form, measure,
#              lexical_category, lexical_class, uni_lemma,
#              age, data_id) %>%
#     summarise(uni_value = any(value),
#               words = paste(definition, collapse = ", ")) %>%
#     group_by(language, form, measure,
#              lexical_category, lexical_class, uni_lemma, words,
#              age) %>%
#     summarise(num_true = sum(uni_value, na.rm = TRUE),
#               num_false = n() - num_true,
#               prop = mean(uni_value, na.rm = TRUE))
#   inst_measure_by_uni %>%
#     split(paste(.$lexical_category, .$lexical_class, .$uni_lemma)) %>%
#     map(fit_inst_measure_uni) %>%
#     bind_rows()
# }
# 
# fit_inst <- function(inst_data) {
#   inst_data %>%
#     split(.$measure) %>%
#     map(fit_inst_measure) %>%
#     bind_rows()
# }
# 
# prop_data <- map(raw_data, fit_inst)
# all_prop_data <- bind_rows(prop_data)
# write_csv(all_prop_data, "app/all_prop_data.csv")

#https://mikabr.io/demo-vocab/momed.html

english_ws<-get_administration_data(language = "English (American)", form = "WS")

write.csv(english_ws, file="englishws.csv",row.names = FALSE)


#new variable for if they are the first born child
english_ws$is_first<-if_else(english_ws$birth_order=="First",TRUE,FALSE)
english_ws$is_first<-na_if("NA")

english_ws$hs_grad<-if_else(english_ws$mom_ed %in% c("Primary","Some Secondary"),FALSE,TRUE)

ggplot(data=english_ws)+geom_point(aes(age,production,color=hs_grad))+geom_smooth(aes(age,production,color=is_first))


item_data<- get_item_data(language = "English (American)", form = "WS")

animals <- get_item_data(language = "English (American)", form = "WS") %>%
  filter(category == "animals")

animal_data <- get_instrument_data(language = "English (American)",
                                   form = "WS",
                                   items = animals$item_id,
                                   administrations = TRUE)
