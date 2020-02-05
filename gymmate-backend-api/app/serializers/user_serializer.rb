class UserSerializer < ActiveModel::Serializer
  attributes :id
  has_one :account
  attributes :message
  has_many :workouts

  def message
    "success"
  end
end
