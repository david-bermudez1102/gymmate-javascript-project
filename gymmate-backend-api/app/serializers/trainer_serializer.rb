class TrainerSerializer < ActiveModel::Serializer

  attributes :id
  has_one :account
  has_many :programs
end
