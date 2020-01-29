class TrainerSerializer < ActiveModel::Serializer

  attributes :id
  has_one :account
  has_many :programs
  attributes :message

  def message
    "success"
  end
end
